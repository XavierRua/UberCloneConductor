
// AI-assisted: see docs/AI_LOG.md #24
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function PrimaryButton({ label, onPress, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  disabled: { backgroundColor: colors.disabled },
  pressed: { opacity: 0.8 },
  label: { color: colors.primaryText, fontSize: 16, fontWeight: '700' },
});

// Botón principal negro, estilo Uber. Se ve gris cuando está deshabilitado.