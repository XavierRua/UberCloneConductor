import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import FilterChips from '../components/FilterChips';
import useSession from '../hooks/useSession';
import useLanguage from '../hooks/useLanguage';
import useEarnings from '../hooks/useEarnings';
import { formatCOP } from '../utils/formatters';
import { colors, radius, spacing, typography } from '../theme';

// Fila de un total: etiqueta a la izquierda y valor a la derecha
function TotalRow({ label, value, strong = false }) {
  return (
    <View style={styles.row}>
      <Text style={typography.caption}>{label}</Text>
      <Text style={[typography.body, strong && styles.strong]}>{value}</Text>
    </View>
  );
}

export default function EarningsScreen() {
  const { driverPhone } = useSession();
  const { t } = useLanguage();
  const { totals, balance, loading, errorMessage } = useEarnings(driverPhone);
  const [period, setPeriod] = useState('today');
  const selected = totals[period];

  // Opciones del filtro en el idioma elegido
  const periodOptions = useMemo(
    () => ['today', 'week', 'month'].map((value) => ({ value, label: t(`periods.${value}`) })),
    [t]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {errorMessage !== '' && <Text style={typography.error}>{errorMessage}</Text>}

      {/* Saldo: lo que la plataforma le debe al conductor (o al revés, si es negativo) */}
      <View style={styles.card}>
        <Text style={typography.caption}>{t('earnings.balance')}</Text>
        <Text style={[styles.balance, { color: balance >= 0 ? colors.success : colors.danger }]}>
          {balance < 0 ? `- ${formatCOP(-balance)}` : formatCOP(balance)}
        </Text>
        <Text style={typography.caption}>{t('earnings.balanceHint')}</Text>
      </View>

      <FilterChips options={periodOptions} value={period} onChange={setPeriod} />

      {/* Totales del periodo elegido */}
      <View style={styles.card}>
        <TotalRow label={t('earnings.trips')} value={String(selected.trips)} />
        <TotalRow label={t('earnings.billed')} value={formatCOP(selected.billed)} />
        <TotalRow label={t('earnings.commissions')} value={`- ${formatCOP(selected.commissions)}`} />
        <TotalRow label={t('earnings.tips')} value={formatCOP(selected.tips)} />
        <TotalRow label={t('earnings.net')} value={formatCOP(selected.net)} strong />
        <TotalRow label={t('earnings.average')} value={formatCOP(selected.average)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  balance: { fontSize: 30, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  strong: { fontWeight: '800', color: colors.success },
});