import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import TripRequestCard from '../components/TripRequestCard';
import ActiveTripPanel from '../components/ActiveTripPanel';
import useSession from '../hooks/useSession';
import useLanguage from '../hooks/useLanguage';
import usePersistentState from '../hooks/usePersistentState';
import useDriverLocation from '../hooks/useDriverLocation';
import useTripRequests from '../hooks/useTripRequests';
import useActiveTrip from '../hooks/useActiveTrip';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { subscribeToDriver, updateDriverAvailability } from '../services/driverService';
import { acceptTrip, createSimulatedTrip, rejectTrip, TRIP_STATUS } from '../services/tripService';
import { getRoute } from '../services/osrmService';
import { colors, radius, shadow, spacing, typography } from '../theme';

// Región inicial mientras llega la ubicación: Medellín
const DEFAULT_REGION = {
  latitude: 6.2442,
  longitude: -75.5812,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const toLatLng = (point) => ({ latitude: point.lat, longitude: point.lng });

// Espacio libre en el mapa para que la tarjeta inferior no tape la ruta
const MAP_PADDING = { top: 80, right: 60, bottom: 440, left: 60 };

export default function HomeScreen() {
  const { driverPhone } = useSession();
  const { t } = useLanguage();
  const { activeTrip, errorMessage: activeTripError } = useActiveTrip();
  const isFocused = useIsFocused(); // false cuando el conductor se va a otra opción del menú
  const insets = useSafeAreaInsets(); // espacio que ocupan la barra de navegación y la de estado
  const mapRef = useRef(null);
  const routeKeyRef = useRef(''); // evita pedir la misma ruta a OSRM más de una vez

  const [driver, setDriver] = useState(null);
  const [statusError, setStatusError] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [responding, setResponding] = useState(false);
  const [tripError, setTripError] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Último estado del interruptor, guardado en el celular (enunciado: AsyncStorage para preferencias)
  const {
    value: isAvailable,
    update: setAvailable,
    ready,
  } = usePersistentState(STORAGE_KEYS.LAST_AVAILABILITY, false);

  // Escucha al conductor en tiempo real para saber si su cuenta está aprobada
  useEffect(() => {
    const unsubscribe = subscribeToDriver(driverPhone, setDriver, (error) =>
      setStatusError(`No se pudo leer el estado de la cuenta: ${error.message}`)
    );
    return unsubscribe; // limpieza: deja de escuchar al salir
  }, [driverPhone]);

  const isApproved = driver?.approvalStatus === 'approved';

  // Solo se sigue la ubicación si está aprobado, Disponible y con la pantalla de Inicio a la vista
  const isTracking = ready && isApproved && isAvailable && isFocused;
  const { location, permissionGranted, errorMessage } = useDriverLocation(driverPhone, isTracking);
  // Con un viaje activo no se reciben solicitudes nuevas
  const { request, errorMessage: requestsError } = useTripRequests(
    driverPhone,
    isTracking && !activeTrip
  );

  // Mantiene Firestore igual al interruptor; si la cuenta deja de estar aprobada, pasa a No disponible
  useEffect(() => {
    if (!driver || !ready) return;

    if (isAvailable && !isApproved) {
      setAvailable(false);
    }

    const shouldBeAvailable = isApproved && isAvailable;
    if (driver.isAvailable !== shouldBeAvailable) {
      updateDriverAvailability(driverPhone, shouldBeAvailable).catch((error) =>
        setStatusError(`No se pudo actualizar la disponibilidad: ${error.message}`)
      );
    }
  }, [driver, ready, isApproved, isAvailable, driverPhone, setAvailable]);

  // Ruta del viaje activo: se pide a OSRM una sola vez por etapa, no en cada movimiento
  useEffect(() => {
    if (!activeTrip) {
      routeKeyRef.current = '';
      setRouteCoordinates([]);
      return;
    }

    const goingToPickup = activeTrip.status === TRIP_STATUS.DRIVER_ARRIVING;
    const onTrip = [TRIP_STATUS.IN_PROGRESS, TRIP_STATUS.COMPLETED, TRIP_STATUS.PAID].includes(
      activeTrip.status
    );
    if (!goingToPickup && !onTrip) {
      setRouteCoordinates([]);
      return;
    }

    const key = `${activeTrip.id}-${goingToPickup ? 'pickup' : 'trip'}`;
    if (routeKeyRef.current === key) return;

    // Si la ruta del viaje ya está guardada en Firestore, se usa esa
    if (onTrip && activeTrip.route) {
      routeKeyRef.current = key;
      setRouteCoordinates(activeTrip.route);
      return;
    }

    // Hacia la recogida se necesita la ubicación actual del conductor
    if (goingToPickup && !location) return;

    routeKeyRef.current = key;
    const from = goingToPickup ? { lat: location.latitude, lng: location.longitude } : activeTrip.origin;
    const to = goingToPickup ? activeTrip.origin : activeTrip.destination;

    getRoute(from, to)
      .then((route) => {
        if (routeKeyRef.current === key) setRouteCoordinates(route.coordinates);
      })
      .catch(() => {
        // Respaldo si OSRM no responde: línea recta entre los dos puntos
        if (routeKeyRef.current === key) setRouteCoordinates([toLatLng(from), toLatLng(to)]);
      });
  }, [activeTrip, location]);

  // El mapa se ajusta a la ruta cuando cambia
  useEffect(() => {
    if (routeCoordinates.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(routeCoordinates, { edgePadding: MAP_PADDING, animated: true });
    }
  }, [routeCoordinates]);

  // Con una solicitud entrante, el mapa muestra el origen y el destino
  useEffect(() => {
    if (request && mapRef.current) {
      mapRef.current.fitToCoordinates([toLatLng(request.origin), toLatLng(request.destination)], {
        edgePadding: MAP_PADDING,
        animated: true,
      });
    }
  }, [request]);

  // Sin solicitud ni viaje activo, el mapa sigue al conductor
  useEffect(() => {
    if (location && mapRef.current && !request && !activeTrip) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  }, [location, request, activeTrip]);

  // Crea una solicitud de prueba (temporal, mientras llega el backend de la profesora)
  const handleSimulate = useCallback(async () => {
    if (!driver) return;
    setTripError('');
    setSimulating(true);
    try {
      await createSimulatedTrip(driver);
    } catch (error) {
      setTripError(`No se pudo simular la solicitud: ${error.message}`);
    } finally {
      setSimulating(false);
    }
  }, [driver]);

  // Manejadores de aceptar y rechazar con useCallback (requisito del enunciado)
  const handleAccept = useCallback(async (trip) => {
    setTripError('');
    setResponding(true);
    try {
      await acceptTrip(trip.id); // el panel del viaje activo aparece solo, por el contexto
    } catch (error) {
      setTripError(`No se pudo aceptar el viaje: ${error.message}`);
    } finally {
      setResponding(false);
    }
  }, []);

  const handleReject = useCallback(async (trip) => {
    setTripError('');
    setResponding(true);
    try {
      await rejectTrip(trip.id, 'driver');
    } catch (error) {
      setTripError(`No se pudo rechazar el viaje: ${error.message}`);
    } finally {
      setResponding(false);
    }
  }, []);

  // Si se vencen los 15 segundos, la solicitud se rechaza automáticamente
  const handleExpire = useCallback(
    async (trip) => {
      try {
        await rejectTrip(trip.id, 'timeout');
        setTripError(t('home.autoRejected'));
      } catch (error) {
        setTripError(`No se pudo rechazar el viaje: ${error.message}`);
      }
    },
    [t]
  );

  // Texto de ayuda debajo del interruptor
  const helpText = () => {
    if (!driver) return t('home.loadingAccount');
    if (!isApproved) return t('home.pendingApproval');
    if (permissionGranted === false) return t('home.needLocation');
    return isAvailable ? t('home.receiving') : t('home.turnOn');
  };

  // Viaje que se dibuja en el mapa: el activo o la solicitud entrante
  const mapTrip = activeTrip ?? request;
  const visibleError =
    errorMessage || statusError || requestsError || tripError || activeTripError;

  return (
    <View style={styles.screen}>
      {/* Mapa con la ubicación del conductor, los puntos del viaje y la ruta */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {mapTrip && (
          <>
            <Marker
              coordinate={toLatLng(mapTrip.origin)}
              title={t('home.pickup')}
              description={mapTrip.origin.address}
              pinColor="green"
            />
            <Marker
              coordinate={toLatLng(mapTrip.destination)}
              title={t('home.destination')}
              description={mapTrip.destination.address}
              pinColor="red"
            />
          </>
        )}
        {activeTrip && routeCoordinates.length > 1 && (
          <Polyline coordinates={routeCoordinates} strokeColor={colors.accent} strokeWidth={5} />
        )}
      </MapView>

      {/* Parte inferior: se separa de la barra de botones del celular con insets.bottom */}
      <View style={[styles.bottom, { bottom: spacing.xl + insets.bottom }]}>
        {activeTrip ? (
          // Viaje en curso: recogida, viaje, cobro y resumen
          <ActiveTripPanel trip={activeTrip} />
        ) : request ? (
          // Solicitud entrante con temporizador
          <TripRequestCard
            trip={request}
            onAccept={handleAccept}
            onReject={handleReject}
            onExpire={handleExpire}
            busy={responding}
          />
        ) : (
          // Tarjeta de disponibilidad
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.statusDot(isApproved && isAvailable)} />
              <Text style={[typography.subtitle, styles.statusText]}>
                {isApproved && isAvailable ? t('home.available') : t('home.unavailable')}
              </Text>
              <Switch
                value={isApproved && isAvailable}
                onValueChange={setAvailable}
                disabled={!ready || !isApproved || permissionGranted === false}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor={colors.surface}
              />
            </View>

            <Text style={typography.caption}>{helpText()}</Text>

            {/* Botón de prueba: solo mientras está Disponible y no hay solicitud */}
            {isTracking && (
              <PrimaryButton
                label={simulating ? t('home.simulating') : t('home.simulate')}
                onPress={handleSimulate}
                variant="secondary"
                disabled={simulating}
              />
            )}
          </View>
        )}

        {/* Errores y avisos en pantalla, no en un Alert */}
        {visibleError !== '' && (
          <View style={styles.errorBox}>
            <Text style={typography.error}>{visibleError}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  bottom: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusText: { flex: 1 },
  // Punto verde si está Disponible, gris si no
  statusDot: (on) => ({
    width: 12,
    height: 12,
    borderRadius: radius.full,
    backgroundColor: on ? colors.success : colors.disabled,
  }),
  errorBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.sm,
    ...shadow,
  },
});