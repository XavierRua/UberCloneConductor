import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSession from '../hooks/useSession';
import usePersistentState from '../hooks/usePersistentState';
import useDriverLocation from '../hooks/useDriverLocation';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { subscribeToDriver, updateDriverAvailability } from '../services/driverService';
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

  // Cada vez que llega una ubicación nueva, el mapa se mueve hacia ella
  useEffect(() => {
    if (location && mapRef.current) {
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
  }, [location]);

  // Texto de ayuda debajo del interruptor
  const helpText = () => {
    if (!driver) return 'Cargando el estado de tu cuenta...';
    if (!isApproved) return 'Tu cuenta está pendiente de aprobación. Aún no puedes ponerte Disponible.';
    if (permissionGranted === false) return 'Activa el permiso de ubicación para poder recibir viajes.';
    return isAvailable
      ? 'Estás recibiendo solicitudes. Tu ubicación se actualiza cada pocos segundos.'
      : 'Activa el interruptor para empezar a recibir solicitudes de viaje.';
  };

  return (
    <View style={styles.screen}>
      {/* Mapa con la ubicación del conductor */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton
      />

      {/* Tarjeta inferior: se separa de la barra de botones del celular con insets.bottom */}
      <View style={[styles.card, { bottom: spacing.xl + insets.bottom }]}>
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

        {/* Errores en pantalla, no en un Alert */}
        {(errorMessage !== '' || statusError !== '') && (
          <Text style={typography.error}>{errorMessage || statusError}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  card: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
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
});