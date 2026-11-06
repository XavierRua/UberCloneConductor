import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import useSession from '../hooks/useSession';
import useKeyboardPadding from '../hooks/useKeyboardPadding';
import { getDriver } from '../services/driverService';
import { validatePhone } from '../utils/validators';
import { colors, spacing, typography } from '../theme';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { startSession } = useSession();
  const keyboardPadding = useKeyboardPadding();

  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const phoneError = validatePhone(phone);

  // Busca al conductor en Firestore; si existe, abre la sesión
  const handleLogin = async () => {
    setTouched(true);
    setLoginError('');
    if (phoneError) return;

    setLoading(true);
    try {
      const driver = await getDriver(phone.trim());
      if (!driver) {
        setLoginError('No hay un conductor registrado con este celular.');
        return;
      }
      await startSession(phone.trim()); // con sesión, la app abre el menú lateral
    } catch (error) {
      setLoginError(`No se pudo iniciar sesión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: spacing.xxl + keyboardPadding }]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={typography.title}>UberClone Conductor</Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Ingresa con el celular con el que te registraste.
      </Text>

      <FormField
        label="Número de celular"
        value={phone}
        onChangeText={setPhone}
        onBlur={() => setTouched(true)}
        error={phoneError}
        showError={touched}
        placeholder="10 dígitos"
        keyboardType="phone-pad"
        maxLength={10}
      />

      <PrimaryButton
        label={loading ? 'Ingresando...' : 'Iniciar sesión'}
        onPress={handleLogin}
        disabled={loading}
      />

      {/* Error del inicio de sesión, debajo del botón (no en un Alert) */}
      {loginError !== '' && <Text style={[typography.error, styles.error]}>{loginError}</Text>}

      {/* Enlace al registro para conductores nuevos */}
      <Pressable onPress={() => navigation.navigate('Register')} style={styles.link}>
        <Text style={typography.body}>
          ¿Aún no tienes cuenta? <Text style={styles.linkText}>Registrarme</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingTop: spacing.xxl },
  subtitle: { marginTop: spacing.sm, marginBottom: spacing.xl },
  error: { marginTop: spacing.md, textAlign: 'center' },
  link: { marginTop: spacing.xl, alignItems: 'center' },
  linkText: { color: colors.accent, fontWeight: '700' },
});