import { createContext, useEffect, useMemo, useState } from 'react';
import useSession from '../hooks/useSession';
import { subscribeToActiveTrip } from '../services/tripService';

export const ActiveTripContext = createContext(null);

export function ActiveTripProvider({ children }) {
  const { driverPhone } = useSession();
  const [activeTrip, setActiveTrip] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!driverPhone) {
      setActiveTrip(null);
      return undefined;
    }

    const unsubscribe = subscribeToActiveTrip(
      driverPhone,
      (trip) => {
        setActiveTrip(trip);
        setErrorMessage('');
      },
      (error) => setErrorMessage(`No se pudo leer el viaje activo: ${error.message}`)
    );

    // Función de limpieza: deja de escuchar al cerrar sesión
    return unsubscribe;
  }, [driverPhone]);

  const value = useMemo(() => ({ activeTrip, errorMessage }), [activeTrip, errorMessage]);

  return <ActiveTripContext.Provider value={value}>{children}</ActiveTripContext.Provider>;
}

// Contexto del viaje activo (enunciado: useContext para la sesión y el viaje activo).
// Escucha en tiempo real el viaje que el conductor está atendiendo.