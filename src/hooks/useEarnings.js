import { useEffect, useMemo, useState } from 'react';
import { subscribeToPaidTrips } from '../services/tripService';
import { getPeriodRange } from '../utils/dateRanges';

const emptyTotals = () => ({ trips: 0, billed: 0, commissions: 0, tips: 0, net: 0, average: 0 });

export default function useEarnings(driverPhone) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Escucha en tiempo real los viajes pagados del conductor
  useEffect(() => {
    if (!driverPhone) return undefined;

    const unsubscribe = subscribeToPaidTrips(
      driverPhone,
      (paidTrips) => {
        setTrips(paidTrips);
        setLoading(false);
      },
      (error) => {
        setErrorMessage(`No se pudieron cargar las ganancias: ${error.message}`);
        setLoading(false);
      }
    );

    return unsubscribe; // limpieza: deja de escuchar al salir
  }, [driverPhone]);

  // Totales y saldo: se recalculan solo cuando cambian los viajes
  const summary = useMemo(() => {
    const ranges = {
      today: getPeriodRange('today'),
      week: getPeriodRange('week'),
      month: getPeriodRange('month'),
    };
    const totals = { today: emptyTotals(), week: emptyTotals(), month: emptyTotals() };
    let balance = 0;

    trips.forEach((trip) => {
      // Saldo: la pasarela le debe al conductor su ganancia; en efectivo, él le debe la comisión a la plataforma
      balance += trip.paymentMethod === 'cash' ? -(trip.commission ?? 0) : trip.driverEarnings ?? 0;

      const completedAt = trip.completedAt?.toDate?.();
      if (!completedAt) return;

      Object.entries(ranges).forEach(([period, { from, to }]) => {
        if (completedAt >= from && completedAt <= to) {
          const periodTotals = totals[period];
          periodTotals.trips += 1;
          periodTotals.billed += trip.fare ?? 0;
          periodTotals.commissions += trip.commission ?? 0;
          periodTotals.tips += trip.tip ?? 0;
          periodTotals.net += trip.driverEarnings ?? 0;
        }
      });
    });

    // Promedio de ganancia neta por viaje
    Object.values(totals).forEach((periodTotals) => {
      periodTotals.average =
        periodTotals.trips > 0 ? Math.round(periodTotals.net / periodTotals.trips) : 0;
    });

    return { totals, balance };
  }, [trips]);

  return { ...summary, loading, errorMessage };
}