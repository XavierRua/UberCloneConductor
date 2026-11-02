import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export default function CheckboxField({ label, checked, onChange, error, showError }) {
  const hasError = showError && Boolean(error);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.row}
        onPress={() => onChange(!checked)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        {/* Casilla marcada o vacía */}
        <Ionicons
          name={checked ? 'checkbox' : 'square-outline'}
          size={24}
          color={hasError ? colors.danger : colors.primary}
        />
        <Text style={[typography.body, styles.label]}>{label}</Text>
      </Pressable>
      {hasError && <Text style={typography.error}>{error}</Text>}
    </View>
  );
}

// AI-assisted: see docs/AI_LOG.md #30

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg, gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  label: { flex: 1 },
});