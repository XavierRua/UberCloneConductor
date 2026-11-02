import { StyleSheet, Text, View } from 'react-native';
import useRegister from '../hooks/useRegister';
import { colors, spacing, typography } from '../theme';

export default function VehicleScreen() {
  const { errors, tabsValid } = useRegister();
  const pending = Object.keys(errors.vehicle).length;

  return (
    <View style={styles.container}>
      {/* Contenido temporal mientras se construye el formulario */}
      <Text style={typography.subtitle}>Vehículo</Text>
      <Text style={typography.caption}>
        {tabsValid.vehicle ? 'Pestaña completa' : `Campos pendientes: ${pending}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, gap: spacing.sm },
});

// este archivo es la pestaña 2 del registro. Por ahora muestra los campos pendientes; 
// el formulario va en un siguiente avance.