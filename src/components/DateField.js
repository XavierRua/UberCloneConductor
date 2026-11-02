import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, radius, spacing, typography } from '../theme';

// Muestra la fecha como dd/mm/aaaa
// AI-assisted: see docs/AI_LOG.md #27
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

export default function DateField({
  label,
  value,
  onChange,
  error,
  showError,
  minimumDate,
  maximumDate,
  defaultDate,
}) {
  const [visible, setVisible] = useState(false);
  const hasError = showError && Boolean(error);

  const handleChange = (event, selectedDate) => {
    // En Android el calendario es un diálogo que se cierra solo; en iOS se cierra con el botón Listo
    if (Platform.OS === 'android') setVisible(false);
    if (event.type === 'set' && selectedDate) onChange(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={typography.label}>{label}</Text>
      <Pressable style={[styles.box, hasError && styles.boxError]} onPress={() => setVisible(true)}>
        <Text style={value ? typography.body : styles.placeholder}>
          {value ? formatDate(value) : 'Seleccionar fecha'}
        </Text>
      </Pressable>

      {/* Calendario nativo del celular */}
      {visible && (
        <DateTimePicker
          value={value ?? defaultDate ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      )}

      {/* En iOS el calendario queda abierto hasta tocar Listo */}
      {visible && Platform.OS === 'ios' && (
        <Pressable style={styles.doneButton} onPress={() => setVisible(false)}>
          <Text style={styles.doneText}>Listo</Text>
        </Pressable>
      )}

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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  boxError: { borderColor: colors.danger },
  placeholder: { fontSize: 15, color: colors.disabled },
  doneButton: { alignSelf: 'flex-end', paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  doneText: { color: colors.accent, fontWeight: '700' },
});

// Selector de fecha reutilizable con etiqueta y mensaje de error debajo