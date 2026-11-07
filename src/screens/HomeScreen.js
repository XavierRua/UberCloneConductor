import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import TripRequestCard from '../components/TripRequestCard';
import useSession from '../hooks/useSession';
import usePersistentState from '../hooks/usePersistentState';
import useDriverLocation from '../hooks/useDriverLocation';
import useTripRequests from '../hooks/useTripRequests';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { subscribeToDriver, updateDriverAvailability } from '../services/driverService';
import { acceptTrip, createSimulatedTrip, rejectTrip } from '../services/tripService';
import { colors, radius, shadow, spacing, typography } from '../theme';

// Región inicial mientras llega la ubicación: Medellín
const DEFAULT_REGION = {
  latitude: 6.2442,
  longitude: -75.5812,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function HomeScreen() {
  const { driverPhone } = useSession();
  const isFocused = useIsFocused(); // false cuando el conductor se va a otra opción del menú
  const insets = useSafeAreaInsets(); // espacio que ocupan la barra de navegación y la de estado
  const mapRef = useRef(null);

  const [driver, setDriver] = useState(null);
  const [statusError, setStatusError] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [responding, setResponding] = useState(false);
  const [acceptedTrip, setAcceptedTrip] = useState(null);
  const [tripError, setTripError] = useState('');

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

  // Solo se sigue la ubicación y se reciben solicitudes si está aprobado, Disponible y en Inicio
  const isTracking = ready && isApproved && isAvailable && isFocused;
  const { location, permissionGranted, errorMessage } = useDriverLocation(driverPhone, isTracking);
  const { request, errorMessage: requestsError } = useTripRequests(driverPhone, isTracking);

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

  // Cada vez que llega una ubicación nueva, el mapa se mueve hacia ella (si no hay solicitud a la vista)
  useEffect(() => {
    if (location && mapRef.current && !request) {
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
  }, [location, request]);

  // Con una solicitud entrante, el mapa muestra el origen y el destino
  useEffect(() => {
    if (request && mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: request.origin.lat, longitude: request.origin.lng },
          { latitude: request.destination.lat, longitude: request.destination.lng },
        ],
        { edgePadding: { top: 80, right: 60, bottom: 420, left: 60 }, animated: true }
      );
    }
  }, [request]);

  // Crea una solicitud de prueba (temporal, mientras llega el backend de la profesora)
  const handleSimulate = useCallback(async () => {
    if (!driver) return;
    setTripError('');
    setAcceptedTrip(null);
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
      await acceptTrip(trip.id);
      setAcceptedTrip(trip);
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
  const handleExpire = useCallback(async (trip) => {
    try {
      await rejectTrip(trip.id, 'timeout');
      setTripError('La solicitud se rechazó automáticamente porque se acabó el tiempo.');
    } catch (error) {
      setTripError(`No se pudo rechazar el viaje: ${error.message}`);
    }
  }, []);

  // Texto de ayuda debajo del interruptor
  const helpText = () => {
    if (!driver) return 'Cargando el estado de tu cuenta...';
    if (!isApproved) return 'Tu cuenta está pendiente de aprobación. Aún no puedes ponerte Disponible.';
    if (permissionGranted === false) return 'Activa el permiso de ubicación para poder recibir viajes.';
    return isAvailable
      ? 'Estás recibiendo solicitudes. Tu ubicación se actualiza cada pocos segundos.'
      : 'Activa el interruptor para empezar a recibir solicitudes de viaje.';
  };

  const visibleError = errorMessage || statusError || requestsError || tripError;

  return (
    <View style={styles.screen}>
      {/* Mapa con la ubicación del conductor y, si hay solicitud, el origen y el destino */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {request && (
          <>
            <Marker
              coordinate={{ latitude: request.origin.lat, longitude: request.origin.lng }}
              title="Recogida"
              description={request.origin.address}
              pinColor="green"
            />
            <Marker
              coordinate={{ latitude: request.destination.lat, longitude: request.destination.lng }}
              title="Destino"
              description={request.destination.address}
              pinColor="red"
            />
          </>
        )}
      </MapView>

      {/* Parte inferior: se separa de la barra de botones del celular con insets.bottom */}
      <View style={[styles.bottom, { bottom: spacing.xl + insets.bottom }]}>
        {request ? (
          // Solicitud entrante con temporizador
          <TripRequestCard
            trip={request}
            onAccept={handleAccept}
            onReject={handleReject}
            onExpire={handleExpire}
            busy={responding}
          />
        ) : (
          <>
            {/* Aviso temporal: el viaje en curso se construye en el siguiente avance */}
            {acceptedTrip && (
              <View style={styles.card}>
                <Text style={typography.subtitle}>Viaje aceptado</Text>
                <Text style={typography.caption}>
                  {acceptedTrip.origin.address} → {acceptedTrip.destination.address}
                </Text>
                <Text style={typography.caption}>
                  La navegación del viaje en curso se agrega en el siguiente avance.
                </Text>
                <PrimaryButton
                  label="Entendido"
                  onPress={() => setAcceptedTrip(null)}
                  variant="secondary"
                />
              </View>
            )}

            {/* Tarjeta de disponibilidad */}
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.statusDot(isApproved && isAvailable)} />
                <Text style={[typography.subtitle, styles.statusText]}>
                  {isApproved && isAvailable ? 'Disponible' : 'No disponible'}
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
                  label={simulating ? 'Creando solicitud...' : 'Simular solicitud'}
                  onPress={handleSimulate}
                  variant="secondary"
                  disabled={simulating}
                />
              )}
            </View>
          </>
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