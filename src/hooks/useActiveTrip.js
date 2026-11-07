import { useContext } from 'react';
import { ActiveTripContext } from '../context/ActiveTripContext';

export default function useActiveTrip() {
  const context = useContext(ActiveTripContext);
  if (!context) {
    throw new Error('useActiveTrip debe usarse dentro de ActiveTripProvider');
  }
  return context;
}


// Hook que encapsula el acceso al contexto del viaje activo