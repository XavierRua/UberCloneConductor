// Función pura del enunciado (sección 5): calcula tarifa, comisión y ganancia neta del conductor.
// Se usa en la estimación de la solicitud y en el cierre del viaje. Valores en pesos colombianos enteros.

import { PRICING, COMMISSION_RATE } from '../config/pricing';

export default function calculateFare({
  distanceKm,
  durationMin,
  category,
  tip = 0,
  commissionRate = COMMISSION_RATE,
}) {
  const multiplier = PRICING.categoryMultipliers[category] ?? 1;

  // (Base + km · valor por km + min · valor por minuto) · multiplicador de la categoría
  const rawFare =
    (PRICING.baseFare + distanceKm * PRICING.perKm + durationMin * PRICING.perMinute) * multiplier;

  // Se redondea al múltiplo de 100 más cercano y se aplica la tarifa mínima
  const roundedFare = Math.round(rawFare / PRICING.roundTo) * PRICING.roundTo;
  const fare = Math.max(PRICING.minimumFare, roundedFare);

  // La comisión se calcula sobre la tarifa; la propina va completa al conductor
  const commission = Math.round(fare * commissionRate);
  const driverEarnings = fare - commission + tip;

  return { fare, commission, driverEarnings };
}

// Función pura del enunciado (sección 5): calcula tarifa, comisión y ganancia neta del conductor.
// Se usa en la estimación de la solicitud y en el cierre del viaje. Valores en pesos colombianos enteros.
