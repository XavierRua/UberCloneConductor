// Pantalla temporal para las secciones del menú que se construyen en los siguientes avances
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export default function ComingSoon({ icon, title, description }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.disabled} />
      <Text style={[typography.subtitle, styles.title]}>{title}</Text>
      <Text style={[typography.caption, styles.description]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  title: { textAlign: 'center' },
  description: { textAlign: 'center' },
});