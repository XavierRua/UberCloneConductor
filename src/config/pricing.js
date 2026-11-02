// AI-assisted: see docs/AI_LOG.md #29
export const PRICING = {
  baseFare: 3500, // tarifa base
  perKm: 1200, // valor por kilómetro
  perMinute: 250, // valor por minuto
  minimumFare: 6000, // tarifa mínima
  roundTo: 100, // la tarifa se redondea al múltiplo de 100 más cercano
  categoryMultipliers: {
    economy: 1.0,
    xl: 1.4,
    premium: 1.8,
  },
};

// Comisión de la plataforma sobre la tarifa (las propinas van completas al conductor)
export const COMMISSION_RATE = 0.2;

// La comisión como número entero para mostrarla en pantalla: 20
export const COMMISSION_PERCENT = Math.round(COMMISSION_RATE * 100);