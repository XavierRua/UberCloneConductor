import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import FormField from '../components/FormField';
import SelectField from '../components/SelectField';
import ImageField from '../components/ImageField';
import PrimaryButton from '../components/PrimaryButton';
import useRegister from '../hooks/useRegister';
import { requiresTechnicalReview } from '../utils/validators';
import {
  VEHICLE_CATEGORIES,
  VEHICLE_COLORS,
  MIN_XL_CAPACITY,
} from '../constants/opcionesRegistro';
import { colors, radius, spacing, typography } from '../theme';

const FIELDS = [
  'category',
  'plate',
  'brand',
  'model',
  'year',
  'color',
  'capacity',
  'vehiclePhoto',
];

export default function VehicleScreen() {
  const navigation = useNavigation();
  const { vehicle, errors, tabsValid, updateVehicle } = useRegister();

  // Campos que el conductor ya tocó: solo a esos se les muestra el error
  const [touched, setTouched] = useState({});
  const fieldErrors = errors.vehicle;
  const pending = Object.keys(fieldErrors).length;

  // Avisos que dependen de lo que ya escribió el conductor
  const isXl = vehicle.category === 'xl';
  const needsReview = requiresTechnicalReview(vehicle.year);

  const touch = (field) => setTouched((current) => ({ ...current, [field]: true }));

  // Para listas y fotos: guarda el valor y marca el campo como tocado
  const changeAndTouch = (field) => (value) => {
    updateVehicle(field, value);
    touch(field);
  };

  const handleNext = () => {
    if (tabsValid.vehicle) {
      navigation.navigate('Documents');
      return;
    }
    // Si falta algo, muestra los errores de todos los campos
    setTouched(Object.fromEntries(FIELDS.map((field) => [field, true])));
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Estado de la pestaña */}
      <Text style={[typography.caption, styles.status]}>
        {tabsValid.vehicle ? 'Pestaña completa ✓' : `Campos pendientes: ${pending}`}
      </Text>

      <SelectField
        label="Categoría"
        value={vehicle.category}
        options={VEHICLE_CATEGORIES}
        onChange={changeAndTouch('category')}
        error={fieldErrors.category}
        showError={touched.category}
      />

      <FormField
        label="Placa"
        value={vehicle.plate}
        onChangeText={(text) => updateVehicle('plate', text.toUpperCase())}
        onBlur={() => touch('plate')}
        error={fieldErrors.plate}
        showError={touched.plate}
        placeholder="ABC123"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={6}
      />

      <FormField
        label="Marca"
        value={vehicle.brand}
        onChangeText={(text) => updateVehicle('brand', text)}
        onBlur={() => touch('brand')}
        error={fieldErrors.brand}
        showError={touched.brand}
        placeholder="Ej: Chevrolet"
        maxLength={30}
      />

      <FormField
        label="Modelo"
        value={vehicle.model}
        onChangeText={(text) => updateVehicle('model', text)}
        onBlur={() => touch('model')}
        error={fieldErrors.model}
        showError={touched.model}
        placeholder="Ej: Onix"
        maxLength={30}
      />

      <FormField
        label="Año"
        value={vehicle.year}
        onChangeText={(text) => updateVehicle('year', text)}
        onBlur={() => touch('year')}
        error={fieldErrors.year}
        showError={touched.year}
        placeholder="Ej: 2021"
        keyboardType="number-pad"
        maxLength={4}
      />

      {/* Aviso: la revisión técnico-mecánica se pedirá en la pestaña Documentos */}
      {needsReview && (
        <View style={styles.notice}>
          <Ionicons name="information-circle" size={18} color={colors.accent} />
          <Text style={[typography.caption, styles.noticeText]}>
            Por la antigüedad del vehículo, en Documentos se pedirá la revisión técnico-mecánica.
          </Text>
        </View>
      )}

      <SelectField
        label="Color"
        value={vehicle.color}
        options={VEHICLE_COLORS}
        onChange={changeAndTouch('color')}
        error={fieldErrors.color}
        showError={touched.color}
      />

      {/* Aviso de capacidad mínima solo para la categoría XL */}
      {isXl && (
        <Text style={[typography.caption, styles.hint]}>
          La categoría XL exige mínimo {MIN_XL_CAPACITY} pasajeros.
        </Text>
      )}

      <FormField
        label="Capacidad de pasajeros"
        value={vehicle.capacity}
        onChangeText={(text) => updateVehicle('capacity', text)}
        onBlur={() => touch('capacity')}
        error={fieldErrors.capacity}
        showError={touched.capacity}
        placeholder={isXl ? `Mínimo ${MIN_XL_CAPACITY}` : 'Ej: 4'}
        keyboardType="number-pad"
        maxLength={2}
      />

      <ImageField
        label="Foto del vehículo (debe verse la placa)"
        uri={vehicle.vehiclePhoto}
        onChange={changeAndTouch('vehiclePhoto')}
        error={fieldErrors.vehiclePhoto}
        showError={touched.vehiclePhoto}
      />

      <PrimaryButton label="Siguiente: Documentos" onPress={handleNext} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  status: { marginBottom: spacing.lg },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  noticeText: { flex: 1, color: colors.text },
  hint: { marginBottom: spacing.xs },
});


/* cambios realizados
1 este archivo es la pestaña 2 del registro. Por ahora muestra los campos pendientes; 
2 se crea el formulario 

*/