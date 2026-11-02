// AI-assisted: see docs/AI_LOG.md #26

import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, radius, spacing, typography } from '../theme';

export default function SelectField({ label, value, options, onChange, error, showError }) {
  const hasError = showError && Boolean(error);

  return (
    <View style={styles.container}>
      <Text style={typography.label}>{label}</Text>
      <View style={[styles.box, hasError && styles.boxError]}>
        <Picker selectedValue={value} onValueChange={(selected) => onChange(selected)}>
          {/* Primera opción vacía: obliga a elegir de forma consciente */}
          <Picker.Item label="Selecciona una opción" value="" color={colors.disabled} />
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
      {hasError && <Text style={typography.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg, gap: spacing.xs },
  box: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  boxError: { borderColor: colors.danger },
});

// Lista desplegable reutilizable con etiqueta y mensaje de error debajo