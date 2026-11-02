import useRegister from '../hooks/useRegister';
import { colors, spacing, typography } from '../theme';

export default function PersonalDataScreen() {
  const { errors, tabsValid } = useRegister();
  const pending = Object.keys(errors.personalData).length;

  return (
    <View style={styles.container}>
      {/* Contenido temporal mientras se construye el formulario */}
      <Text style={typography.subtitle}>Datos personales</Text>
      <Text style={typography.caption}>
        {tabsValid.personalData ? 'Pestaña completa' : `Campos pendientes: ${pending}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, gap: spacing.sm },
});

// Pestaña 1 del registro. Por ahora muestra los campos pendientes; el formulario va en el siguiente avance.
import { StyleSheet, Text, View } from 'react-native';