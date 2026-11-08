import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import useLanguage from '../hooks/useLanguage';
import { formatCOP, formatDistance, formatDuration } from '../utils/formatters';
import { colors, radius, shadow, spacing, typography } from '../theme';

export const REQUEST_TIMEOUT_SECONDS = 15;

export default function TripRequestCard({ trip, onAccept, onReject, onExpire, busy }) {
  const { t } = useLanguage();
  const [secondsLeft, setSecondsLeft] = useState(REQUEST_TIMEOUT_SECONDS);
  const expiredRef = useRef(false);

  // Temporizador: cuenta regresiva de 15 s cada vez que llega una solicitud nueva
  useEffect(() => {
    setSecondsLeft(REQUEST_TIMEOUT_SECONDS);
    expiredRef.current = false;

    const intervalId = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    // Función de limpieza: detiene el temporizador si la solicitud cambia o la tarjeta se cierra
    return () => clearInterval(intervalId);
  }, [trip.id]);

  // Al llegar a cero, la solicitud se rechaza automáticamente (una sola vez)
  useEffect(() => {
    if (secondsLeft === 0 && !expiredRef.current && !busy) {
      expiredRef.current = true;
      onExpire(trip);
    }
  }, [secondsLeft, busy, onExpire, trip]);

  const progress = secondsLeft / REQUEST_TIMEOUT_SECONDS;
  const isUrgent = secondsLeft <= 5;

  return (
    <View style={styles.card}>
      {/* Encabezado con la cuenta regresiva */}
      <View style={styles.header}>
        <Text style={typography.subtitle}>{t('request.title')}</Text>
        <View style={[styles.timer, isUrgent && styles.timerUrgent]}>
          <Text style={styles.timerText}>{secondsLeft} s</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress * 100}%` },
            isUrgent && styles.progressUrgent,
          ]}
        />
      </View>

      {/* Origen y destino */}
      <View style={styles.place}>
        <Ionicons name="ellipse" size={12} color={colors.success} />
        <Text style={[typography.body, styles.placeText]}>{trip.origin.address}</Text>
      </View>
      <View style={styles.place}>
        <Ionicons name="location" size={14} color={colors.danger} />
        <Text style={[typography.body, styles.placeText]}>{trip.destination.address}</Text>
      </View>

      {/* Distancia, duración, categoría y método de pago */}
      <Text style={typography.caption}>
        {formatDistance(trip.distanceKm)} · {formatDuration(trip.durationMin)} ·{' '}
        {t(`category.${trip.category}`)} · {t(`payment.method.${trip.paymentMethod}`)}
      </Text>

      {/* Tarifa estimada y ganancia neta estimada del conductor */}
      <View style={styles.amounts}>
        <View>
          <Text style={typography.caption}>{t('request.estimatedFare')}</Text>
          <Text style={typography.subtitle}>{formatCOP(trip.estimatedFare)}</Text>
        </View>
        <View style={styles.earnings}>
          <Text style={typography.caption}>{t('request.yourEarnings')}</Text>
          <Text style={[typography.subtitle, styles.earningsText]}>
            {formatCOP(trip.estimatedEarnings)}
          </Text>
        </View>
      </View>

      {/* Botones Rechazar y Aceptar */}
      <View style={styles.buttons}>
        <View style={styles.button}>
          <PrimaryButton
            label={t('request.reject')}
            onPress={() => onReject(trip)}
            variant="secondary"
            disabled={busy}
          />
        </View>
        <View style={styles.button}>
          <PrimaryButton
            label={busy ? t('request.accepting') : t('request.accept')}
            onPress={() => onAccept(trip)}
            disabled={busy}
          />
        </View>
      </View>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timer: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  timerUrgent: { backgroundColor: colors.danger },
  timerText: { color: colors.primaryText, fontWeight: '700' },
  progressTrack: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: colors.primary },
  progressUrgent: { backgroundColor: colors.danger },
  place: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  placeText: { flex: 1 },
  amounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  earnings: { alignItems: 'flex-end' },
  earningsText: { color: colors.success },
  buttons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  button: { flex: 1 },
});