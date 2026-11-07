// Pesos colombianos con punto de miles: 19200 → "$ 19.200"
export const formatCOP = (value) =>
  `$ ${Math.round(value ?? 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

// Kilómetros con coma decimal: 8.5 → "8,5 km"
export const formatDistance = (km) => `${String(km).replace('.', ',')} km`;

export const formatDuration = (minutes) => `${minutes} min`;

// Nombre visible de cada método de pago
export const PAYMENT_METHOD_LABELS = {
  cash: 'Efectivo',
  mercadopago: 'Mercado Pago',
  stripe: 'Stripe',
};

// Estados del pago que pide el enunciado: Aprobado, Pendiente, Rechazado o Efectivo
export const PAYMENT_STATUS_LABELS = {
  approved: 'Aprobado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
  cash: 'Efectivo',
};

// Formatos para mostrar dinero, distancia y duración en pantalla
// Pesos colombianos con punto de miles: 19200 → "$ 19.200"
// Formatos para mostrar dinero, distancia, duración y estados en pantalla