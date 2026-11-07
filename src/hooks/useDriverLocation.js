import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { updateDriverLocation } from '../services/driverService';

// Cada 5 segundos, aunque el conductor no se mueva (distanceInterval 0)
const TRACKING_OPTIONS = {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 5000,
  distanceInterval: 0,
};

export default function useDriverLocation(phone, isTracking) {
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null); // null = todavía no se sabe
  const [errorMessage, setErrorMessage] = useState('');

  // Al abrir la pantalla: pide el permiso y obtiene la ubicación actual para centrar el mapa
  useEffect(() => {
    let active = true;

    const loadCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!active) return;
        if (status !== 'granted') {
          setPermissionGranted(false);
          return;
        }
        setPermissionGranted(true);

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (active) setLocation(current.coords);
      } catch (error) {
        if (active) setErrorMessage(`No se pudo obtener la ubicación: ${error.message}`);
      }
    };

    loadCurrentLocation();

    return () => {
      active = false;
    };
  }, []);

  // Mientras el conductor está Disponible: sigue la ubicación y la envía a Firestore
  useEffect(() => {
    if (!isTracking || !permissionGranted || !phone) return undefined;

    let active = true;
    let subscription = null;

    Location.watchPositionAsync(TRACKING_OPTIONS, (position) => {
      setLocation(position.coords);
      updateDriverLocation(phone, position.coords).catch((error) =>
        setErrorMessage(`No se pudo enviar la ubicación: ${error.message}`)
      );
    })
      .then((newSubscription) => {
        // Si la pantalla ya se cerró mientras arrancaba el seguimiento, se detiene de inmediato
        if (active) {
          subscription = newSubscription;
        } else {
          newSubscription.remove();
        }
      })
      .catch((error) => setErrorMessage(`No se pudo seguir la ubicación: ${error.message}`));

    // Función de limpieza: al pasar a No disponible o salir de la pantalla, el seguimiento se detiene
    return () => {
      active = false;
      if (subscription) subscription.remove();
    };
  }, [isTracking, permissionGranted, phone]);

  return { location, permissionGranted, errorMessage };
}

// Hook personalizado del enunciado: obtiene la ubicación del conductor y, mientras está Disponible,
// la sigue y la envía a Firestore cada pocos segundos.