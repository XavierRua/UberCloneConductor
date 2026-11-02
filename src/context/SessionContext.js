// AI-assisted: see docs/AI_LOG.md #34

import { createContext, useCallback, useMemo } from 'react';
import usePersistentState from '../hooks/usePersistentState';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const { value: driverPhone, update, ready } = usePersistentState(STORAGE_KEYS.SESSION, null);

  const startSession = useCallback((phone) => update(phone), [update]);
  const endSession = useCallback(() => update(null), [update]);

  const value = useMemo(
    () => ({ driverPhone, ready, startSession, endSession }),
    [driverPhone, ready, startSession, endSession]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

// Contexto de sesión: recuerda qué conductor está registrado en este celular.
// En AsyncStorage solo se guarda el celular (la sesión), nunca los datos personales.