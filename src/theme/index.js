import { Platform } from 'react-native';

export const colors = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  primary: '#000000', // negro, color principal estilo Uber
  primaryText: '#FFFFFF', // texto sobre botones negros
  primarySoft: '#EEEEEE',
  accent: '#276EF1', // azul para enlaces y elementos activos
  success: '#05A357', // disponible, pago aprobado
  warning: '#FFC043', // pendiente de aprobación, pago pendiente
  danger: '#E11900', // errores, eliminar, rechazado
  text: '#000000',
  textSecondary: '#6B6B6B',
  border: '#E2E2E2',
  disabled: '#AFAFAF',
};

// Escala de espaciado 
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
};

export const typography = {
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, color: colors.text },
  caption: { fontSize: 13, color: colors.textSecondary },
  label: { fontSize: 13, fontWeight: '600', color: colors.text },
  error: { fontSize: 12, color: colors.danger }, // mensaje debajo de cada campo
};

export const shadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
});

// Color de cada categoría de vehículo (las mismas que elige el pasajero)
export const categoryColors = {
  economy: colors.success,
  xl: colors.accent,
  premium: colors.primary,
};

export default { colors, spacing, radius, typography, shadow, categoryColors };