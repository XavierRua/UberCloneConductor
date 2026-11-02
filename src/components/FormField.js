import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export default function FormField({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  showError,
  ...inputProps
}) {
  const hasError = showError && Boolean(error);

  return (
    <View style={styles.container}>
      <Text style={typography.label}>{label}</Text>
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholderTextColor={colors.disabled}
        {...inputProps}
      />
      {/* El error se muestra debajo del campo, como pide el enunciado */}
      {hasError && <Text style={typography.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg, gap: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
});

// Campo de texto reutilizable con etiqueta y mensaje de error debajo (no en un Alert)S