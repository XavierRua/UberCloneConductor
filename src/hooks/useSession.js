// AI-assisted: see docs/AI_LOG.md #35

import { useContext } from 'react';
import { SessionContext } from '../context/SessionContext';

export default function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe usarse dentro de SessionProvider');
  }
  return context;
}

// Hook que encapsula el acceso al contexto de sesión