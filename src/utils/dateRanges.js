export const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfDay = (date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

// La semana empieza el lunes
export const startOfWeek = (date) => {
  const result = startOfDay(date);
  const day = result.getDay(); // 0 = domingo, 1 = lunes...
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - daysSinceMonday);
  return result;
};

export const startOfMonth = (date) => {
  const result = startOfDay(date);
  result.setDate(1);
  return result;
};

// Devuelve { from, to } para 'today', 'week' o 'month'; para cualquier otro valor, sin límites
export const getPeriodRange = (period, now = new Date()) => {
  switch (period) {
    case 'today':
      return { from: startOfDay(now), to: endOfDay(now) };
    case 'week':
      return { from: startOfWeek(now), to: endOfDay(now) };
    case 'month':
      return { from: startOfMonth(now), to: endOfDay(now) };
    default:
      return { from: null, to: null };
  }
};

// Fecha y hora como dd/mm/aaaa hh:mm
export const formatDateTime = (date) => {
  if (!date) return '';
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};