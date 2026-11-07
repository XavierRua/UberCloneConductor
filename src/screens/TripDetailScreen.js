// Detalle de un viaje: ruta guardada dibujada con Polyline, distancia, duración, cobro y calificación
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getTrip } from '../services/tripService';
import { VEHICLE_CATEGORIES } from '../constants/opcionesRegistro';
import { formatDateTime } from '../utils/dateRanges';
import {
  formatCOP,
  formatDistance,
  formatDuration,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from '../utils/formatters';
import { colors, radius, spacing, typography } from '../theme';

const toLatLng = (point) => ({ latitude: point.lat, longitude: point.lng });
const findLabel = (options, value) => options.find((option) => option.value === value)?.label ?? value;

// Fila del detalle: etiqueta a la izquierda y valor a la derecha
function DetailRow({ label, value, strong = false }) {
  return (
    <View style={styles.row}>
      <Text style={typography.caption}>{label}</Text>
      <Text style={[typography.body, styles.rowValue, strong && styles.strong]}>{value}</Text>
    </View>
  );
}

export default function TripDetailScreen({ route }) {
  const { tripId } = route.params;
  const mapRef = useRef(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    getTrip(tripId)
      .then((data) => {
        if (active) setTrip(data);
      })
      .catch((error) => {
        if (active) setErrorMessage(`No se pudo cargar el viaje: ${error.message}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tripId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <Text style={typography.error}>{errorMessage || 'No se encontró el viaje.'}</Text>
      </View>
    );
  }

  // Ruta guardada al iniciar el viaje; si no existe, línea recta entre origen y destino
  const routeCoordinates = trip.route?.length > 1 ? trip.route : [toLatLng(trip.origin), toLatLng(trip.destination)];
  const rating = trip.rating ?? 0;
  const commissionPercent = Math.round((trip.commissionRate ?? 0.2) * 100);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Mapa con la ruta del viaje */}
      <MapView
        ref={mapRef}
        style={styles.map}
        onMapReady={() =>
          mapRef.current?.fitToCoordinates(routeCoordinates, {
            edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
            animated: false,
          })
        }
      >
        <Marker coordinate={toLatLng(trip.origin)} title="Recogida" pinColor="green" />
        <Marker coordinate={toLatLng(trip.destination)} title="Destino" pinColor="red" />
        <Polyline coordinates={routeCoordinates} strokeColor={colors.accent} strokeWidth={5} />
      </MapView>

      <View style={styles.card}>
        <DetailRow label="Fecha" value={formatDateTime(trip.completedAt?.toDate?.())} />
        <DetailRow label="Origen" value={trip.origin.address} />
        <DetailRow label="Destino" value={trip.destination.address} />
        <DetailRow label="Categoría" value={findLabel(VEHICLE_CATEGORIES, trip.category)} />
        <DetailRow label="Distancia" value={formatDistance(trip.distanceKm)} />
        <DetailRow label="Duración" value={formatDuration(trip.durationMin)} />
        <DetailRow label="Método de pago" value={PAYMENT_METHOD_LABELS[trip.paymentMethod] ?? trip.paymentMethod} />
        <DetailRow label="Estado del pago" value={PAYMENT_STATUS_LABELS[trip.paymentStatus] ?? trip.paymentStatus} />
      </View>

      <View style={styles.card}>
        <DetailRow label="Tarifa" value={formatCOP(trip.fare)} />
        <DetailRow label={`Comisión (${commissionPercent} %)`} value={`- ${formatCOP(trip.commission)}`} />
        <DetailRow label="Propina" value={formatCOP(trip.tip)} />
        <DetailRow label="Ganancia neta" value={formatCOP(trip.driverEarnings)} strong />
        <DetailRow
          label="Calificación del pasajero"
          value={rating > 0 ? `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}` : 'Sin calificar'}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  map: { height: 260, borderRadius: radius.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  rowValue: { flex: 1, textAlign: 'right' },
  strong: { fontWeight: '800', color: colors.success },
});