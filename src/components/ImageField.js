import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

export default function ImageField({ label, uri, onChange, error, showError, round = false }) {
  const [permissionMessage, setPermissionMessage] = useState('');
  const hasError = showError && Boolean(error);

  const pickImage = async (source) => {
    setPermissionMessage('');

    // Pide permiso según el origen elegido
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setPermissionMessage('Debes permitir el acceso para agregar la foto');
      return;
    }

    // quality 0.5 reduce el tamaño de la foto para que luego suba más rápido
    const options = { mediaTypes: ['images'], allowsEditing: true, quality: 0.5 };
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={typography.label}>{label}</Text>

      {/* Vista previa de la foto o ícono vacío */}
      <View style={[styles.preview, round && styles.round, hasError && styles.previewError]}>
        {uri ? (
          <Image source={{ uri }} style={[styles.image, round && styles.round]} />
        ) : (
          <Ionicons name="camera-outline" size={36} color={colors.disabled} />
        )}
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => pickImage('camera')}>
          <Ionicons name="camera" size={18} color={colors.text} />
          <Text style={typography.label}>Cámara</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => pickImage('gallery')}>
          <Ionicons name="images" size={18} color={colors.text} />
          <Text style={typography.label}>Galería</Text>
        </Pressable>
      </View>

      {permissionMessage !== '' && <Text style={typography.error}>{permissionMessage}</Text>}
      {hasError && <Text style={typography.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg, gap: spacing.sm, alignItems: 'flex-start' },
  preview: {
    width: 140,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  round: { width: 110, height: 110, borderRadius: radius.full },
  previewError: { borderColor: colors.danger },
  image: { width: '100%', height: '100%' },
  buttons: { flexDirection: 'row', gap: spacing.sm },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});

// Foto reutilizable: se toma con la cámara o se elige de la galería, y se muestra la vista previa.
// Aquí solo se guarda la ruta local de la foto; la subida a internet se hace en otro avance.