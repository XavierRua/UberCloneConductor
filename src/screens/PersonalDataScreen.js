import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FormField from '../components/FormField';
import SelectField from '../components/SelectField';
import DateField from '../components/DateField';
import ImageField from '../components/ImageField';
import PrimaryButton from '../components/PrimaryButton';
import useRegister from '../hooks/useRegister';
import { GENDERS, LANGUAGES } from '../constants/opcionesRegistro';
import { colors, spacing, typography } from '../theme';

const FIELDS = [
  'profilePhoto',
  'fullName',
  'documentId',
  'phone',
  'birthDate',
  'gender',
  'email',
  'language',
];

// Fecha que muestra el calendario al abrirlo: 1 de enero de hace 25 años
const defaultBirthDate = new Date(new Date().getFullYear() - 25, 0, 1);

export default function PersonalDataScreen() {
  const navigation = useNavigation();
  const { personalData, errors, tabsValid, updatePersonalData } = useRegister();

  // Campos que el conductor ya tocó: solo a esos se les muestra el error
  const [touched, setTouched] = useState({});
  const fieldErrors = errors.personalData;
  const pending = Object.keys(fieldErrors).length;

  const touch = (field) => setTouched((current) => ({ ...current, [field]: true }));

  // Para listas, fechas y fotos: guarda el valor y marca el campo como tocado
  const changeAndTouch = (field) => (value) => {
    updatePersonalData(field, value);
    touch(field);
  };

  const handleNext = () => {
    if (tabsValid.personalData) {
      navigation.navigate('Vehicle');
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
        {tabsValid.personalData ? 'Pestaña completa ✓' : `Campos pendientes: ${pending}`}
      </Text>

      <ImageField
        label="Foto de perfil"
        uri={personalData.profilePhoto}
        onChange={changeAndTouch('profilePhoto')}
        error={fieldErrors.profilePhoto}
        showError={touched.profilePhoto}
        round
      />

      <FormField
        label="Nombre completo"
        value={personalData.fullName}
        onChangeText={(text) => updatePersonalData('fullName', text)}
        onBlur={() => touch('fullName')}
        error={fieldErrors.fullName}
        showError={touched.fullName}
        placeholder="Ej: Xavier Rua"
        maxLength={50}
        autoCapitalize="words"
      />

      <FormField
        label="Documento de identidad"
        value={personalData.documentId}
        onChangeText={(text) => updatePersonalData('documentId', text)}
        onBlur={() => touch('documentId')}
        error={fieldErrors.documentId}
        showError={touched.documentId}
        placeholder="Entre 6 y 10 dígitos"
        keyboardType="number-pad"
        maxLength={10}
      />

      <FormField
        label="Número de celular"
        value={personalData.phone}
        onChangeText={(text) => updatePersonalData('phone', text)}
        onBlur={() => touch('phone')}
        error={fieldErrors.phone}
        showError={touched.phone}
        placeholder="10 dígitos"
        keyboardType="phone-pad"
        maxLength={10}
      />

      <DateField
        label="Fecha de nacimiento"
        value={personalData.birthDate}
        onChange={changeAndTouch('birthDate')}
        error={fieldErrors.birthDate}
        showError={touched.birthDate}
        maximumDate={new Date()}
        defaultDate={defaultBirthDate}
      />

      <SelectField
        label="Género"
        value={personalData.gender}
        options={GENDERS}
        onChange={changeAndTouch('gender')}
        error={fieldErrors.gender}
        showError={touched.gender}
      />

      <FormField
        label="Correo electrónico"
        value={personalData.email}
        onChangeText={(text) => updatePersonalData('email', text)}
        onBlur={() => touch('email')}
        error={fieldErrors.email}
        showError={touched.email}
        placeholder="nombre@dominio.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <SelectField
        label="Idioma"
        value={personalData.language}
        options={LANGUAGES}
        onChange={changeAndTouch('language')}
        error={fieldErrors.language}
        showError={touched.language}
      />

      <PrimaryButton label="Siguiente: Vehículo" onPress={handleNext} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  status: { marginBottom: spacing.lg },
});


/* modificaciones 

1. Datos personales” y “Campos pendientes: 7
2. se crea el formulario en el siguiente avance

*/