import { useEffect, useState } from 'react';
import { subscribeToTripRequests } from '../services/tripService';

export default function useTripRequests(driverPhone, enabled) {
  const [requests, setRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!enabled || !driverPhone) {
      setRequests([]);
      return undefined;
    }

    const unsubscribe = subscribeToTripRequests(
      driverPhone,
      (trips) => {
        setRequests(trips);
        setErrorMessage('');
      },
      (error) => setErrorMessage(`No se pudieron leer las solicitudes: ${error.message}`)
    );

    // Función de limpieza: deja de escuchar al pasar a No disponible o salir de la pantalla
    return unsubscribe;
  }, [driverPhone, enabled]);

  // Se atiende una solicitud a la vez: la más antigua
  return { request: requests[0] ?? null, errorMessage };
}


// Hook personalizado del enunciado: escucha en tiempo real las solicitudes de viaje del conductor.
// Solo escucha mientras enabled es true (conductor aprobado, Disponible y en la pantalla de Inicio).