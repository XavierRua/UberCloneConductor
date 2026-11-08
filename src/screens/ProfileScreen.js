// AI-assisted: see docs/AI_LOG.md #36
// AI-assisted: see docs/AI_LOG.md #40

import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import useSession from '../hooks/useSession';
import useLanguage from '../hooks/useLanguage';
import { deleteDriver, subscribeToDriver } from '../services/driverService';
import { colors, radius, spacing, typography } from '../theme';

// Fotos de documentos que se muestran como miniaturas (la foto de perfil va aparte)
const DOCUMENT_PHOTOS = ['vehicle', 'license', 'soat', 'technicalReview'];

export default function ProfileScreen() {
  const { driverPhone, endSession } = useSession();
  const { t } = useLanguage();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Escucha al conductor en tiempo real: si cambia approvalStatus en Firebase, la pantalla se actualiza sola
  useEffect(() => {
    const unsubscribe = subscribeToDriver(
      driverPhone,
      (data) => {
        setDriver(data);
        setLoading(false);
      },
      (error) => {
        setErrorMessage(t('profile.loadError', { message: error.message }));
        setLoading(false);
      }
    );

    // Función de limpieza: deja de escuchar cuando la pantalla se cierra o cambia el celular
    return unsubscribe;
  }, [driverPhone, t]);

  // Borra el conductor de Firestore y cierra la sesión
  const removeDriver = useCallback(async () => {
    setErrorMessage('');
    setDeleting(true);
    try {
      await deleteDriver(driverPhone);
      await endSession(); // al no haber sesión, la app vuelve a Iniciar sesión
    } catch (error) {
      setErrorMessage(t('profile.deleteError', { message: error.message }));
      setDeleting(false);
    }
  }, [driverPhone, endSession, t]);

  // Pide confirmación antes de borrar: la acción no se puede deshacer
  const confirmDelete = useCallback(() => {
    Alert.alert(t('profile.delete'), t('profile.deleteConfirm', { phone: driverPhone }), [
      { text: t('profile.cancel'), style: 'cancel' },
      { text: t('profile.deleteAction'), style: 'destructive', onPress: removeDriver },
    ]);
  }, [driverPhone, removeDriver, t]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isApproved = driver?.approvalStatus === 'approved';
  const photos = driver?.photos ?? {};
  // Fotos de documentos que existen (la revisión técnico-mecánica puede no estar)
  const documentPhotos = DOCUMENT_PHOTOS.filter((key) => photos[key]?.url);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {errorMessage !== '' && <Text style={typography.error}>{errorMessage}</Text>}

      {/* Si el documento ya no existe en Firestore (por ejemplo, se borró desde la consola) */}
      {!driver && errorMessage === '' && !deleting && (
        <Text style={typography.body}>{t('profile.notFound', { phone: driverPhone })}</Text>
      )}

      {driver && (
        <View style={styles.card}>
          {/* Foto de perfil desde Cloudinary, o un ícono si no hay */}
          {photos.profile?.url ? (
            <Image source={{ uri: photos.profile.url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Ionicons name="person" size={40} color={colors.disabled} />
            </View>
          )}

          <Text style={typography.title}>{driver.fullName}</Text>
          <Text style={typography.caption}>{t('profile.phone', { phone: driver.phone })}</Text>
          <Text style={typography.caption}>
            {t('profile.vehicle', {
              category: t(`category.${driver.vehicle.category}`),
              plate: driver.vehicle.plate,
            })}
          </Text>

          {/* Estado de la cuenta: cambia en vivo cuando se aprueba en Firebase */}
          <View
            style={[styles.badge, { backgroundColor: isApproved ? colors.success : colors.warning }]}
          >
            <Text style={[styles.badgeText, isApproved && styles.badgeTextApproved]}>
              {t(`profile.approval.${driver.approvalStatus}`)}
            </Text>
          </View>

          <Text style={typography.caption}>
            {isApproved ? t('profile.approvedText') : t('profile.pendingText')}
          </Text>
        </View>
      )}

      {/* Miniaturas de las fotos del vehículo y de los documentos */}
      {documentPhotos.length > 0 && (
        <View style={styles.card}>
          <Text style={typography.subtitle}>{t('profile.documentsTitle')}</Text>
          <View style={styles.photoGrid}>
            {documentPhotos.map((key) => (
              <View key={key} style={styles.photoItem}>
                <Image source={{ uri: photos[key].url }} style={styles.thumbnail} />
                <Text style={typography.caption}>{t(`profile.photos.${key}`)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <PrimaryButton
        label={t('profile.logout')}
        onPress={endSession}
        variant="secondary"
        disabled={deleting}
      />

      {/* Borra al conductor de la base de datos (requisito de la primera entrega) */}
      <PrimaryButton
        label={deleting ? t('profile.deleting') : t('profile.delete')}
        onPress={confirmDelete}
        variant="danger"
        disabled={deleting}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  avatar: { width: 96, height: 96, borderRadius: radius.full, marginBottom: spacing.sm },
  avatarEmpty: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  badgeText: { fontWeight: '700', color: colors.text },
  badgeTextApproved: { color: colors.primaryText },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  photoItem: { width: '46%', gap: spacing.xs },
  thumbnail: { width: '100%', height: 90, borderRadius: radius.sm, backgroundColor: colors.primarySoft },
});