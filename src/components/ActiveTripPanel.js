import { useCallback, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import useLanguage from '../hooks/useLanguage';
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
import { formatCOP, formatDistance, formatDuration } from '../utils/formatters';
import { colors, radius, shadow, spacing, typography } from '../theme';

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
  const { t } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Ejecuta una acción del viaje mostrando el estado de carga y el error en pantalla
  const run = useCallback(
    async (action) => {
      setErrorMessage('');
      setBusy(true);
      try {
        await action();
      } catch (error) {
        setErrorMessage(t('trip.actionError', { message: error.message }));
      } finally {
        setBusy(false);
      }
    },
    [t]
  );

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
          setErrorMessage(t('trip.noApprovedPayment'));
        }
      }),
    [run, trip.id, t]
  );

  // Cancelar solo antes de que el pasajero esté a bordo, con confirmación
  const confirmCancel = useCallback(() => {
    Alert.alert(t('trip.cancelTrip'), t('trip.cancelConfirm'), [
      { text: t('trip.no'), style: 'cancel' },
      { text: t('trip.yesCancel'), style: 'destructive', onPress: () => run(() => cancelTrip(trip.id)) },
    ]);
  }, [run, trip.id, t]);

  const { status } = trip;
  const isCash = trip.paymentMethod === 'cash';
  const canCancel = status === TRIP_STATUS.ACCEPTED || status === TRIP_STATUS.DRIVER_ARRIVING;
  const showAmounts = status === TRIP_STATUS.COMPLETED || status === TRIP_STATUS.PAID;
  const commissionPercent = Math.round((trip.commissionRate ?? 0.2) * 100);
  const loadingLabel = t('trip.oneMoment');

  return (
    <View style={styles.card}>
      <Text style={typography.subtitle}>{t(`trip.status.${status}`)}</Text>

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
        {t(`payment.method.${trip.paymentMethod}`)}
      </Text>

      {/* Cobro: tarifa final, comisión, propina, ganancia neta y estado del pago */}
      {showAmounts && (
        <View style={styles.amounts}>
          <AmountRow label={t('trip.finalFare')} value={formatCOP(trip.fare)} />
          <AmountRow
            label={t('trip.commission', { percent: commissionPercent })}
            value={`- ${formatCOP(trip.commission)}`}
          />
          <AmountRow label={t('trip.tip')} value={formatCOP(trip.tip)} />
          <AmountRow label={t('trip.netEarnings')} value={formatCOP(trip.driverEarnings)} strong />
          <AmountRow
            label={t('trip.paymentStatus')}
            value={trip.paymentStatus ? t(`payment.status.${trip.paymentStatus}`) : ''}
          />
        </View>
      )}

      {errorMessage !== '' && <Text style={typography.error}>{errorMessage}</Text>}

      {/* Acción principal según el estado del viaje */}
      {status === TRIP_STATUS.ACCEPTED && (
        <PrimaryButton
          label={busy ? loadingLabel : t('trip.goToPickup')}
          onPress={() => run(() => startPickup(trip.id))}
          disabled={busy}
        />
      )}

      {status === TRIP_STATUS.DRIVER_ARRIVING && (
        <PrimaryButton
          label={busy ? loadingLabel : t('trip.passengerOnBoard')}
          onPress={() => run(() => startTrip(trip))}
          disabled={busy}
        />
      )}

      {status === TRIP_STATUS.IN_PROGRESS && (
        <PrimaryButton
          label={busy ? t('trip.calculating') : t('trip.finish')}
          onPress={() => run(() => completeTrip(trip))}
          disabled={busy}
        />
      )}

      {status === TRIP_STATUS.COMPLETED && isCash && (
        <PrimaryButton
          label={busy ? loadingLabel : t('trip.confirmCash')}
          onPress={() => run(() => confirmCashPayment(trip.id))}
          disabled={busy}
        />
      )}

      {/* Mercado Pago: checkout de prueba abierto en el navegador */}
      {status === TRIP_STATUS.COMPLETED && !isCash && (
        <>
          <PrimaryButton
            label={busy ? loadingLabel : t('trip.payWithMp')}
            onPress={payWithMercadoPago}
            disabled={busy}
          />
          <Text style={typography.caption}>{t('trip.mpHint')}</Text>
          <PrimaryButton
            label={busy ? t('trip.verifying') : t('trip.verify')}
            onPress={checkPayment}
            variant="secondary"
            disabled={busy}
          />

          {/* Respaldo si el backend no está encendido */}
          <Text style={typography.caption}>{t('trip.simulateHint')}</Text>
          <View style={styles.buttons}>
            <View style={styles.button}>
              <PrimaryButton
                label={t('trip.simulateReject')}
                onPress={() => run(() => simulateOnlinePayment(trip.id, false))}
                variant="secondary"
                disabled={busy}
              />
            </View>
            <View style={styles.button}>
              <PrimaryButton
                label={t('trip.simulateApprove')}
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
          label={t('trip.done')}
          onPress={() => run(() => closeTripSummary(trip.id))}
          disabled={busy}
        />
      )}

      {canCancel && (
        <PrimaryButton
          label={t('trip.cancelTrip')}
          onPress={confirmCancel}
          variant="secondary"
          disabled={busy}
        />
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