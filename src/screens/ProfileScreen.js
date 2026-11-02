// AI-assisted: see docs/AI_LOG.md #36

import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import useSession from '../hooks/useSession';
import { getDriver } from '../services/driverService';
import { VEHICLE_CATEGORIES } from '../constants/opcionesRegistro';
import { colors, radius, spacing, typography } from '../theme';

const APPROVAL_LABELS = {
  pending: 'Pendiente de aprobación',
  approved: 'Aprobado',
};


const findLabel = (options, value) => options.find((option) => option.value === value)?.label ?? value;

export default function ProfileScreen() {
  const { driverPhone, endSession } = useSession();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

 
  useEffect(() => {
    let active = true;

    getDriver(driverPhone)
      .then((data) => {
        if (active) setDriver(data);
      })
      .catch((error) => {
        if (active) setErrorMessage(`No se pudieron cargar los datos: ${error.message}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [driverPhone]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {errorMessage !== '' && <Text style={typography.error}>{errorMessage}</Text>}

      {/* Si el documento ya no existe en Firestore (por ejemplo, se borró desde la consola) */}
      {!driver && errorMessage === '' && (
        <Text style={typography.body}>No se encontró un conductor con el celular {driverPhone}.</Text>
      )}

      {driver && (
        <View style={styles.card}>
          <Text style={typography.title}>{driver.fullName}</Text>
          <Text style={typography.caption}>Celular: {driver.phone}</Text>
          <Text style={typography.caption}>
            Vehículo: {findLabel(VEHICLE_CATEGORIES, driver.vehicle.category)} · {driver.vehicle.plate}
          </Text>

          {/* Estado de la cuenta (enunciado: queda pendiente hasta que se apruebe) */}
          <View
            style={[
              styles.badge,
              { backgroundColor: driver.approvalStatus === 'approved' ? colors.success : colors.warning },
            ]}
          >
            <Text style={styles.badgeText}>
              {APPROVAL_LABELS[driver.approvalStatus] ?? driver.approvalStatus}
            </Text>
          </View>
        </View>
      )}

      <PrimaryButton label="Cerrar sesión" onPress={endSession} />
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
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  badgeText: { fontWeight: '700', color: colors.text },
});

// Perfil del conductor: lee sus datos desde Firestore. En el avance 12 se agrega Eliminar usuario.