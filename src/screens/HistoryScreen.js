import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import FilterChips from '../components/FilterChips';
import DateField from '../components/DateField';
import PrimaryButton from '../components/PrimaryButton';
import useSession from '../hooks/useSession';
import useLanguage from '../hooks/useLanguage';
import { getTripHistoryPage } from '../services/tripService';
import { endOfDay, formatDateTime, getPeriodRange, startOfDay } from '../utils/dateRanges';
import { formatCOP } from '../utils/formatters';
import { colors, radius, spacing, typography } from '../theme';

// Un viaje de la lista
function TripItem({ trip, onPress }) {
  const { t } = useLanguage();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
      <View style={styles.itemHeader}>
        <Text style={typography.caption}>{formatDateTime(trip.completedAt?.toDate?.())}</Text>
        <Text style={typography.caption}>
          {trip.paymentStatus ? t(`payment.status.${trip.paymentStatus}`) : ''}
        </Text>
      </View>
      <Text style={typography.body} numberOfLines={2}>
        {trip.origin.address} → {trip.destination.address}
      </Text>
      <View style={styles.itemFooter}>
        <Text style={[typography.caption, styles.itemInfo]}>
          {t(`category.${trip.category}`)} · {t(`payment.method.${trip.paymentMethod}`)} ·{' '}
          {t('history.fare', { amount: formatCOP(trip.fare) })}
        </Text>
        <Text style={styles.itemEarnings}>{formatCOP(trip.driverEarnings)}</Text>
      </View>
    </Pressable>
  );
}

export default function HistoryScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { driverPhone } = useSession();
  const { t } = useLanguage();

  const [period, setPeriod] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [rangeFrom, setRangeFrom] = useState(null);
  const [rangeTo, setRangeTo] = useState(null);

  const [trips, setTrips] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Opciones de los filtros en el idioma elegido
  const periodOptions = useMemo(
    () => ['all', 'today', 'week', 'month', 'range'].map((value) => ({ value, label: t(`periods.${value}`) })),
    [t]
  );
  const paymentOptions = useMemo(
    () => [
      { value: 'all', label: t('history.allPayments') },
      { value: 'cash', label: t('payment.method.cash') },
      { value: 'mercadopago', label: t('payment.method.mercadopago') },
    ],
    [t]
  );

  // Fechas del filtro elegido
  const dateRange = useMemo(() => {
    if (period === 'range') {
      return {
        from: rangeFrom ? startOfDay(rangeFrom) : null,
        to: rangeTo ? endOfDay(rangeTo) : null,
      };
    }
    return getPeriodRange(period);
  }, [period, rangeFrom, rangeTo]);

  // Primera página: se carga al abrir la pantalla y cada vez que cambia el filtro de fechas
  useEffect(() => {
    if (!isFocused || !driverPhone) return undefined;
    let active = true;

    setLoading(true);
    setErrorMessage('');
    getTripHistoryPage(driverPhone, dateRange)
      .then((page) => {
        if (!active) return;
        setTrips(page.trips);
        setCursor(page.cursor);
        setHasMore(page.hasMore);
      })
      .catch((error) => {
        if (active) setErrorMessage(t('history.loadError', { message: error.message }));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    // Limpieza: si el filtro cambia antes de que llegue la respuesta, se ignora la anterior
    return () => {
      active = false;
    };
  }, [isFocused, driverPhone, dateRange, t]);

  // Siguiente página de 20 viajes
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;
    setLoading(true);
    try {
      const page = await getTripHistoryPage(driverPhone, { ...dateRange, cursor });
      setTrips((current) => [...current, ...page.trips]);
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch (error) {
      setErrorMessage(t('history.loadMoreError', { message: error.message }));
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor, driverPhone, dateRange, t]);

  // Filtro por método de pago sobre los viajes cargados
  const visibleTrips = useMemo(
    () => (paymentFilter === 'all' ? trips : trips.filter((trip) => trip.paymentMethod === paymentFilter)),
    [trips, paymentFilter]
  );

  const openDetail = useCallback(
    (trip) => navigation.navigate('TripDetail', { tripId: trip.id }),
    [navigation]
  );

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={visibleTrips}
      keyExtractor={(trip) => trip.id}
      renderItem={({ item }) => <TripItem trip={item} onPress={() => openDetail(item)} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      ListHeaderComponent={
        <View style={styles.filters}>
          <FilterChips options={periodOptions} value={period} onChange={setPeriod} />

          {/* Rango de fechas: solo cuando se elige ese filtro */}
          {period === 'range' && (
            <View style={styles.rangeRow}>
              <View style={styles.rangeField}>
                <DateField
                  label={t('history.from')}
                  value={rangeFrom}
                  onChange={setRangeFrom}
                  maximumDate={new Date()}
                  placeholder={t('common.selectDate')}
                  doneLabel={t('common.done')}
                />
              </View>
              <View style={styles.rangeField}>
                <DateField
                  label={t('history.to')}
                  value={rangeTo}
                  onChange={setRangeTo}
                  maximumDate={new Date()}
                  placeholder={t('common.selectDate')}
                  doneLabel={t('common.done')}
                />
              </View>
            </View>
          )}

          <FilterChips options={paymentOptions} value={paymentFilter} onChange={setPaymentFilter} />

          {errorMessage !== '' && <Text style={typography.error}>{errorMessage}</Text>}
        </View>
      }
      ListEmptyComponent={
        !loading && errorMessage === '' ? (
          // Mensaje vacío en lugar de una lista en blanco (enunciado)
          <Text style={[typography.caption, styles.empty]}>{t('history.empty')}</Text>
        ) : null
      }
      ListFooterComponent={
        loading ? (
          <ActivityIndicator style={styles.footer} color={colors.primary} />
        ) : hasMore ? (
          <View style={styles.footer}>
            <PrimaryButton label={t('history.loadMore')} onPress={loadMore} variant="secondary" />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },
  filters: { gap: spacing.md, marginBottom: spacing.md },
  rangeRow: { flexDirection: 'row', gap: spacing.sm },
  rangeField: { flex: 1 },
  item: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  itemPressed: { opacity: 0.7 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  itemInfo: { flex: 1 },
  itemEarnings: { fontSize: 15, fontWeight: '800', color: colors.success },
  empty: { textAlign: 'center', marginTop: spacing.xl },
  footer: { marginTop: spacing.md },
});