// AI-assisted: see docs/AI_LOG.md #31
// AI-assisted: see docs/AI_LOG.md #32

// AI-assisted: see docs/AI_LOG.md #21
// Pestaña 3 del registro: documentos, pagos y términos (sección 2 del enunciado).
// Aquí está el botón Enviar registro, que solo se habilita con las tres pestañas válidas.
// Envío a Firestore: see docs/AI_LOG.md #22
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormField from '../components/FormField';
import DateField from '../components/DateField';
import ImageField from '../components/ImageField';
import CheckboxField from '../components/CheckboxField';
import PrimaryButton from '../components/PrimaryButton';
import useRegister from '../hooks/useRegister';
import useSession from '../hooks/useSession';
import { requiresTechnicalReview } from '../utils/validators';
import { createDriver, phoneExists } from '../services/driverService';
import { COMMISSION_PERCENT } from '../config/pricing';
import { colors, radius, spacing, typography } from '../theme';

const BASE_FIELDS = [
  'licenseNumber',
  'licensePhoto',
  'licenseExpiry',
  'soatPhoto',
  'soatExpiry',
  'mercadoPagoEmail',
  'termsAccepted',
];
const REVIEW_FIELDS = ['technicalReviewPhoto', 'technicalReviewExpiry'];

// Nombre visible de cada pestaña para el resumen final
const TAB_NAMES = {
  personalData: 'Datos personales',
  vehicle: 'Vehículo',
  documents: 'Documentos',
};

export default function DocumentsScreen() {
  const {
    personalData,
    vehicle,
    documents,
    errors,
    tabsValid,
    canSubmit,
    updateDocuments,
    resetRegister,
  } = useRegister();
  const { startSession } = useSession();

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fieldErrors = errors.documents;
  const pending = Object.keys(fieldErrors).length;

  // La revisión técnico-mecánica depende del año escrito en la pestaña Vehículo
  const needsReview = requiresTechnicalReview(vehicle.year);

  // Los vencimientos deben ser posteriores a hoy: el calendario empieza en mañana
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  // El calendario se abre por defecto en un año a partir de hoy
  const defaultExpiry = new Date();
  defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);

  const touch = (field) => setTouched((current) => ({ ...current, [field]: true }));

  // Para fechas, fotos y la casilla: guarda el valor y marca el campo como tocado
  const changeAndTouch = (field) => (value) => {
    updateDocuments(field, value);
    touch(field);
  };

  // Muestra los errores de todos los campos de esta pestaña
  const showAllErrors = () => {
    const fields = needsReview ? [...BASE_FIELDS, ...REVIEW_FIELDS] : BASE_FIELDS;
    setTouched(Object.fromEntries(fields.map((field) => [field, true])));
  };

  // Guarda el conductor en Firestore y abre la sesión
  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const phone = personalData.phone.trim();

      // Un solo conductor por celular
      if (await phoneExists(phone)) {
        setSubmitError('Ya existe un conductor registrado con este celular.');
        return;
      }

      // Pendiente: subir las fotos a Storage antes de guardar (avance 10)
      await createDriver(personalData, vehicle, documents);
      resetRegister();
      await startSession(phone);
    } catch (error) {
      setSubmitError(`No se pudo enviar el registro: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Estado de la pestaña */}
      <Text style={[typography.caption, styles.status]}>
        {tabsValid.documents ? 'Pestaña completa ✓' : `Campos pendientes: ${pending}`}
      </Text>

      {/* Licencia de conducción */}
      <Text style={[typography.subtitle, styles.section]}>Licencia de conducción</Text>
      <FormField
        label="Número de licencia"
        value={documents.licenseNumber}
        onChangeText={(text) => updateDocuments('licenseNumber', text)}
        onBlur={() => touch('licenseNumber')}
        error={fieldErrors.licenseNumber}
        showError={touched.licenseNumber}
        placeholder="Solo números"
        keyboardType="number-pad"
        maxLength={15}
      />
      <ImageField
        label="Foto de la licencia"
        uri={documents.licensePhoto}
        onChange={changeAndTouch('licensePhoto')}
        error={fieldErrors.licensePhoto}
        showError={touched.licensePhoto}
      />
      <DateField
        label="Vencimiento de la licencia"
        value={documents.licenseExpiry}
        onChange={changeAndTouch('licenseExpiry')}
        error={fieldErrors.licenseExpiry}
        showError={touched.licenseExpiry}
        minimumDate={tomorrow}
        defaultDate={defaultExpiry}
      />

      {/* SOAT */}
      <Text style={[typography.subtitle, styles.section]}>SOAT</Text>
      <ImageField
        label="Foto del SOAT"
        uri={documents.soatPhoto}
        onChange={changeAndTouch('soatPhoto')}
        error={fieldErrors.soatPhoto}
        showError={touched.soatPhoto}
      />
      <DateField
        label="Vencimiento del SOAT"
        value={documents.soatExpiry}
        onChange={changeAndTouch('soatExpiry')}
        error={fieldErrors.soatExpiry}
        showError={touched.soatExpiry}
        minimumDate={tomorrow}
        defaultDate={defaultExpiry}
      />

      {/* Revisión técnico-mecánica: solo si aplica según el año del vehículo */}
      <Text style={[typography.subtitle, styles.section]}>Revisión técnico-mecánica</Text>
      {needsReview ? (
        <>
          <ImageField
            label="Foto de la revisión técnico-mecánica"
            uri={documents.technicalReviewPhoto}
            onChange={changeAndTouch('technicalReviewPhoto')}
            error={fieldErrors.technicalReviewPhoto}
            showError={touched.technicalReviewPhoto}
          />
          <DateField
            label="Vencimiento de la revisión técnico-mecánica"
            value={documents.technicalReviewExpiry}
            onChange={changeAndTouch('technicalReviewExpiry')}
            error={fieldErrors.technicalReviewExpiry}
            showError={touched.technicalReviewExpiry}
            minimumDate={tomorrow}
            defaultDate={defaultExpiry}
          />
        </>
      ) : (
        <Text style={[typography.caption, styles.note]}>
          {vehicle.year
            ? 'No aplica por la antigüedad del vehículo.'
            : 'Escribe el año del vehículo en la pestaña Vehículo para saber si aplica.'}
        </Text>
      )}

      {/* Pagos */}
      <Text style={[typography.subtitle, styles.section]}>Pagos</Text>
      <FormField
        label="Correo de la cuenta de Mercado Pago"
        value={documents.mercadoPagoEmail}
        onChangeText={(text) => updateDocuments('mercadoPagoEmail', text)}
        onBlur={() => touch('mercadoPagoEmail')}
        error={fieldErrors.mercadoPagoEmail}
        showError={touched.mercadoPagoEmail}
        placeholder="nombre@dominio.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={[typography.caption, styles.note]}>
        Solo pedimos el correo donde recibirías tus pagos. La app nunca guarda números de cuenta
        bancaria ni de tarjeta.
      </Text>

      {/* Términos con el porcentaje de comisión visible */}
      <CheckboxField
        label={`Acepto los términos y condiciones. La plataforma cobra una comisión del ${COMMISSION_PERCENT} % sobre la tarifa de cada viaje; las propinas son completas para el conductor.`}
        checked={documents.termsAccepted}
        onChange={changeAndTouch('termsAccepted')}
        error={fieldErrors.termsAccepted}
        showError={touched.termsAccepted}
      />

      {/* Resumen de las tres pestañas antes de enviar */}
      <View style={styles.summary}>
        {Object.entries(TAB_NAMES).map(([key, name]) => (
          <View key={key} style={styles.summaryRow}>
            <Ionicons
              name={tabsValid[key] ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={tabsValid[key] ? colors.success : colors.textSecondary}
            />
            <Text style={typography.body}>{name}</Text>
          </View>
        ))}
      </View>

      {/* Enlace para ver los errores de esta pestaña */}
      {!tabsValid.documents && (
        <Pressable onPress={showAllErrors} style={styles.link}>
          <Text style={styles.linkText}>Mostrar los campos pendientes de esta pestaña</Text>
        </Pressable>
      )}

      <PrimaryButton
        label={submitting ? 'Enviando...' : 'Enviar registro'}
        onPress={handleSubmit}
        disabled={!canSubmit || submitting}
      />

      {/* Error del envío, debajo del botón (no en un Alert) */}
      {submitError !== '' && (
        <Text style={[typography.error, styles.submitError]}>{submitError}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  status: { marginBottom: spacing.sm },
  section: { marginTop: spacing.md, marginBottom: spacing.md },
  note: { marginBottom: spacing.lg },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  link: { marginBottom: spacing.lg },
  linkText: { color: colors.accent, fontWeight: '600' },
  submitError: { marginTop: spacing.md, textAlign: 'center' },
});


/* avances en este archivo:  

1. Pestaña 3 del registro. Por ahora muestra los campos pendientes; el formulario va en un 
2. el botón Enviar registro, que solo se habilita con las tres pestañas válidas

*/