// Configuración: idioma de la app (español / inglés), guardado en AsyncStorage y en el perfil del conductor
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FilterChips from '../components/FilterChips';
import useLanguage from '../hooks/useLanguage';
import useSession from '../hooks/useSession';
import { updateDriverLanguage } from '../services/driverService';
import { LANGUAGES } from '../constants/opcionesRegistro';
import { colors, radius, spacing, typography } from '../theme';

export default function SettingsScreen() {
  const { language, setLanguage, t } = useLanguage();
  const { driverPhone } = useSession();
  const [message, setMessage] = useState('');

  // Cambia el idioma al instante y lo guarda también en Firestore (dato editable del perfil)
  const changeLanguage = async (newLanguage) => {
    await setLanguage(newLanguage);
    setMessage('');
    try {
      if (driverPhone) await updateDriverLanguage(driverPhone, newLanguage);
      setMessage('saved');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={typography.subtitle}>{t('settings.languageTitle')}</Text>
        <Text style={typography.caption}>{t('settings.languageDescription')}</Text>
        <FilterChips options={LANGUAGES} value={language} onChange={changeLanguage} />
        {message === 'saved' && <Text style={styles.saved}>{t('settings.saved')}</Text>}
        {message !== '' && message !== 'saved' && <Text style={typography.error}>{message}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  saved: { color: colors.success, fontWeight: '600' },
});