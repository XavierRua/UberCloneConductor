// AI-assisted: see docs/AI_LOG.md #36
// AI-assisted: see docs/AI_LOG.md #40

import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import useSession from '../hooks/useSession';
import { deleteDriver, subscribeToDriver } from '../services/driverService';
import { VEHICLE_CATEGORIES } from '../constants/opcionesRegistro';
import { colors, radius, spacing, typography } from '../theme';

const APPROVAL_LABELS = {
  pending: 'Pendiente de aprobación',
  approved: 'Aprobado',
};

// Nombre visible de cada foto de documentos
const PHOTO_LABELS = {
  vehicle: 'Vehículo',
  license: 'Licencia',
  soat: 'SOAT',
  technicalReview: 'Revisión técnico-mecánica',
};

// Busca el texto visible de una opción a partir de su valor
const findLabel = (options, value) => options.find((option) => option.value === value)?.label ?? value;

export default function ProfileScreen() {
  const { driverPhone, endSession } = useSession();
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
        setErrorMessage(`No se pudieron cargar los datos: ${error.message}`);
        setLoading(false);
      }
    );

    // Función de limpieza: deja de escuchar cuando la pantalla se cierra o cambia el celular
    return unsubscribe;
  }, [driverPhone]);

  // Borra el conductor de Firestore y cierra la sesión
  const removeDriver = useCallback(async () => {
    setErrorMessage('');
    setDeleting(true);
    try {
      await deleteDriver(driverPhone);
      await endSession(); // al no haber sesión, la app vuelve al registro
    } catch (error) {
      setErrorMessage(`No se pudo eliminar el usuario: ${error.message}`);
      setDeleting(false);
    }
  }, [driverPhone, endSession]);

  // Pide confirmación antes de borrar: la acción no se puede deshacer
  const confirmDelete = useCallback(() => {
    Alert.alert(
      'Eliminar usuario',
      `Se borrarán todos los datos del conductor con celular ${driverPhone}. Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: removeDriver },
      ]
    );
  }, [driverPhone, removeDriver]);

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
  const documentPhotos = Object.entries(PHOTO_LABELS).filter(([key]) => photos[key]?.url);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {errorMessage !== '' && <Text style={typography.error}>{errorMessage}</Text>}

      {/* Si el documento ya no existe en Firestore (por ejemplo, se borró desde la consola) */}
      {!driver && errorMessage === '' && !deleting && (
        <Text style={typography.body}>No se encontró un conductor con el celular {driverPhone}.</Text>
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
          <Text style={typography.caption}>Celular: {driver.phone}</Text>
          <Text style={typography.caption}>
            Vehículo: {findLabel(VEHICLE_CATEGORIES, driver.vehicle.category)} · {driver.vehicle.plate}
          </Text>

          {/* Estado de la cuenta: cambia en vivo cuando se aprueba en Firebase */}
          <View
            style={[styles.badge, { backgroundColor: isApproved ? colors.success : colors.warning }]}
          >
            <Text style={[styles.badgeText, isApproved && styles.badgeTextApproved]}>
              {APPROVAL_LABELS[driver.approvalStatus] ?? driver.approvalStatus}
            </Text>
          </View>

          <Text style={typography.caption}>
            {isApproved
              ? 'Tu cuenta fue aprobada. Ya puedes ponerte Disponible para recibir viajes.'
              : 'Tu cuenta está en revisión. No podrás ponerte Disponible hasta que sea aprobada.'}
          </Text>
        </View>
      )}

      {/* Miniaturas de las fotos del vehículo y de los documentos */}
      {documentPhotos.length > 0 && (
        <View style={styles.card}>
          <Text style={typography.subtitle}>Documentos</Text>
          <View style={styles.photoGrid}>
            {documentPhotos.map(([key, label]) => (
              <View key={key} style={styles.photoItem}>
                <Image source={{ uri: photos[key].url }} style={styles.thumbnail} />
                <Text style={typography.caption}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <PrimaryButton label="Cerrar sesión" onPress={endSession} variant="secondary" disabled={deleting} />

      {/* Borra al conductor de la base de datos (requisito de la primera entrega) */}
      <PrimaryButton
        label={deleting ? 'Eliminando...' : 'Eliminar usuario'}
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

// modificaciones al archivo: 
// Perfil del conductor: lee sus datos desde Firestore. En el avance 12 se agrega Eliminar usuario.
// Eliminar usuario
// Actualización en tiempo real con onSnapshot