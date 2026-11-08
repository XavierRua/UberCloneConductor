import { useCallback, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import {
  cancelTrip,
  closeTripSummary,
  completeTrip,
  confirmCashPayment,
  simulateOnlinePayment,
  startPickup,
  startTrip,
  TRIP_STATUS,
} from '../services/tripService';
import { createPaymentPreference, verifyPayment } from '../services/paymentService';
import {
  formatCOP,
  formatDistance,
  formatDuration,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from '../utils/formatters';
import { colors, radius, shadow, spacing, typography } from '../theme';

const STATUS_TITLES = {
  [TRIP_STATUS.ACCEPTED]: 'Viaje aceptado',
  [TRIP_STATUS.DRIVER_ARRIVING]: 'Rumbo a la recogida',
  [TRIP_STATUS.IN_PROGRESS]: 'Viaje en curso',
  [TRIP_STATUS.COMPLETED]: 'Cobro del viaje',
  [TRIP_STATUS.PAID]: 'Resumen del viaje',
};

// Fila de un valor del cobro: etiqueta a la izquierda y monto a la derecha
function AmountRow({ label, value, strong = false }) {
  return (
    <View style={styles.amountRow}>
      <Text style={typography.caption}>{label}</Text>
      <Text style={[typography.body, strong && styles.amountStrong]}>{value}</Text>
    </View>
  );
}

export default function ActiveTripPanel({ trip }) {
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Ejecuta una acción del viaje mostrando el estado de carga y el error en pantalla
  const run = useCallback(async (action) => {
    setErrorMessage('');
    setBusy(true);
    try {
      await action();
    } catch (error) {
      setErrorMessage(`No se pudo completar la acción: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }, []);

  // Pide la preferencia al backend y abre el checkout de Mercado Pago en el navegador
  const payWithMercadoPago = useCallback(
    () =>
      run(async () => {
        const { checkoutUrl } = await createPaymentPreference(trip.id);
        await Linking.openURL(checkoutUrl);
      }),
    [run, trip.id]
  );

  // Le pide al backend que busque el pago en Mercado Pago (si la redirección no llegó)
  const checkPayment = useCallback(
    () =>
      run(async () => {
        const { paymentStatus } = await verifyPayment(trip.id);
        if (paymentStatus === 'pending') {
          setErrorMessage('Mercado Pago todavía no registra un pago aprobado para este viaje.');
        }
      }),
    [run, trip.id]
  );

  // Cancelar solo antes de que el pasajero esté a bordo, con confirmación
  const confirmCancel = useCallback(() => {
    Alert.alert('Cancelar viaje', '¿Seguro que quieres cancelar este viaje?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => run(() => cancelTrip(trip.id)) },
    ]);
  }, [run, trip.id]);

  const { status } = trip;
  const isCash = trip.paymentMethod === 'cash';
  const canCancel = status === TRIP_STATUS.ACCEPTED || status === TRIP_STATUS.DRIVER_ARRIVING;
  const showAmounts = status === TRIP_STATUS.COMPLETED || status === TRIP_STATUS.PAID;
  const commissionPercent = Math.round((trip.commissionRate ?? 0.2) * 100);

  return (
    <View style={styles.card}>
      <Text style={typography.subtitle}>{STATUS_TITLES[status] ?? 'Viaje'}</Text>

      {/* Origen y destino */}
      <View style={styles.place}>
        <Ionicons name="ellipse" size={12} color={colors.success} />
        <Text style={[typography.body, styles.placeText]}>{trip.origin.address}</Text>
      </View>
      <View style={styles.place}>
        <Ionicons name="location" size={14} color={colors.danger} />
        <Text style={[typography.body, styles.placeText]}>{trip.destination.address}</Text>
      </View>
      <Text style={typography.caption}>
        {formatDistance(trip.distanceKm)} · {formatDuration(trip.durationMin)} ·{' '}
        {PAYMENT_METHOD_LABELS[trip.paymentMethod] ?? trip.paymentMethod}
      </Text>

      {/* Cobro: tarifa final, comisión, propina, ganancia neta y estado del pago */}
      {showAmounts && (
        <View style={styles.amounts}>
          <AmountRow label="Tarifa final" value={formatCOP(trip.fare)} />
          <AmountRow label={`Comisión (${commissionPercent} %)`} value={`- ${formatCOP(trip.commission)}`} />
          <AmountRow label="Propina" value={formatCOP(trip.tip)} />
          <AmountRow label="Tu ganancia neta" value={formatCOP(trip.driverEarnings)} strong />
          <AmountRow
            label="Estado del pago"
            value={PAYMENT_STATUS_LABELS[trip.paymentStatus] ?? trip.paymentStatus}
          />
        </View>
      )}

      {errorMessage !== '' && <Text style={typography.error}>{errorMessage}</Text>}

      {/* Acción principal según el estado del viaje */}
      {status === TRIP_STATUS.ACCEPTED && (
        <PrimaryButton
          label={busy ? 'Un momento...' : 'Ir a recoger al pasajero'}
          onPress={() => run(() => startPickup(trip.id))}
          disabled={busy}
        />
      )}

      {status === TRIP_STATUS.DRIVER_ARRIVING && (
        <PrimaryButton
          label={busy ? 'Un momento...' : 'Pasajero a bordo'}
          onPress={() => run(() => startTrip(trip))}
          disabled={busy}
        />
      )}

      {status === TRIP_STATUS.IN_PROGRESS && (
        <PrimaryButton
          label={busy ? 'Calculando la tarifa...' : 'Finalizar viaje'}
          onPress={() => run(() => completeTrip(trip))}
          disabled={busy}
        />
      )}

      {status === TRIP_STATUS.COMPLETED && isCash && (
        <PrimaryButton
          label={busy ? 'Un momento...' : 'Confirmar pago en efectivo recibido'}
          onPress={() => run(() => confirmCashPayment(trip.id))}
          disabled={busy}
        />
      )}

      {/* Mercado Pago: checkout de prueba abierto en el navegador */}
      {status === TRIP_STATUS.COMPLETED && !isCash && (
        <>
          <PrimaryButton
            label={busy ? 'Un momento...' : 'Cobrar con Mercado Pago'}
            onPress={payWithMercadoPago}
            disabled={busy}
          />
          <Text style={typography.caption}>
            Cuando el pasajero termine de pagar, este panel se actualiza solo. Si no cambia, verifica el pago:
          </Text>
          <PrimaryButton
            label={busy ? 'Verificando...' : 'Ya pagó: verificar pago'}
            onPress={checkPayment}
            variant="secondary"
            disabled={busy}
          />

          {/* Respaldo si el backend no está encendido */}
          <Text style={typography.caption}>Sin backend, puedes simular la respuesta:</Text>
          <View style={styles.buttons}>
            <View style={styles.button}>
              <PrimaryButton
                label="Simular rechazo"
                onPress={() => run(() => simulateOnlinePayment(trip.id, false))}
                variant="secondary"
                disabled={busy}
              />
            </View>
            <View style={styles.button}>
              <PrimaryButton
                label="Simular aprobado"
                onPress={() => run(() => simulateOnlinePayment(trip.id, true))}
                variant="secondary"
                disabled={busy}
              />
            </View>
          </View>
        </>
      )}

      {status === TRIP_STATUS.PAID && (
        <PrimaryButton
          label="Listo"
          onPress={() => run(() => closeTripSummary(trip.id))}
          disabled={busy}
        />
      )}

      {canCancel && (
        <PrimaryButton label="Cancelar viaje" onPress={confirmCancel} variant="secondary" disabled={busy} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow,
  },
  place: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  placeText: { flex: 1 },
  amounts: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between' },
  amountStrong: { fontWeight: '800', color: colors.success },
  buttons: { flexDirection: 'row', gap: spacing.sm },
  button: { flex: 1 },
});