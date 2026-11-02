
// AI-assisted: see docs/AI_LOG.md #24
// AI-assisted: see docs/AI_LOG.md #19
// Botón principal estilo Uber. Variantes: primary (negro), secondary (con borde) y danger (rojo).

import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function PrimaryButton({ label, onPress, disabled = false, variant = 'primary' }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.label, variant === 'secondary' && styles.labelSecondary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  disabled: { backgroundColor: colors.disabled, borderColor: colors.disabled },
  pressed: { opacity: 0.8 },
  label: { color: colors.primaryText, fontSize: 16, fontWeight: '700' },
  labelSecondary: { color: colors.primary },
});

// Botón principal negro, estilo Uber. Se ve gris cuando está deshabilitado.