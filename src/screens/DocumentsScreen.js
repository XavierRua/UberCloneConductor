import { StyleSheet, Text, View } from 'react-native';
import useRegister from '../hooks/useRegister';
import { colors, spacing, typography } from '../theme';

export default function DocumentsScreen() {
  const { errors, tabsValid } = useRegister();
  const pending = Object.keys(errors.documents).length;

  return (
    <View style={styles.container}>
      {/* Contenido temporal mientras se construye el formulario */}
      <Text style={typography.subtitle}>Documentos y pagos</Text>
      <Text style={typography.caption}>
        {tabsValid.documents ? 'Pestaña completa' : `Campos pendientes: ${pending}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, gap: spacing.sm },
});

// Pestaña 3 del registro. Por ahora muestra los campos pendientes; el formulario va en un 
// siguiente avance.