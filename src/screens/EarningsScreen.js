// Ganancias (sección 5 del enunciado): totales de hoy, la semana y el mes, y el saldo del conductor
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import FilterChips from '../components/FilterChips';
import useSession from '../hooks/useSession';
import useEarnings from '../hooks/useEarnings';
import { formatCOP } from '../utils/formatters';
import { colors, radius, spacing, typography } from '../theme';

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
];

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
  const { totals, balance, loading, errorMessage } = useEarnings(driverPhone);
  const [period, setPeriod] = useState('today');
  const selected = totals[period];

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
        <Text style={typography.caption}>Saldo</Text>
        <Text style={[styles.balance, { color: balance >= 0 ? colors.success : colors.danger }]}>
          {balance < 0 ? `- ${formatCOP(-balance)}` : formatCOP(balance)}
        </Text>
        <Text style={typography.caption}>
          Ganancias de los viajes pagados con Mercado Pago menos las comisiones de los viajes en
          efectivo.
        </Text>
      </View>

      <FilterChips options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />

      {/* Totales del periodo elegido */}
      <View style={styles.card}>
        <TotalRow label="Viajes" value={String(selected.trips)} />
        <TotalRow label="Total facturado" value={formatCOP(selected.billed)} />
        <TotalRow label="Comisiones" value={`- ${formatCOP(selected.commissions)}`} />
        <TotalRow label="Propinas" value={formatCOP(selected.tips)} />
        <TotalRow label="Ganancia neta" value={formatCOP(selected.net)} strong />
        <TotalRow label="Promedio por viaje" value={formatCOP(selected.average)} />
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