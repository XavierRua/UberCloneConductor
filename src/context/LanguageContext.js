// Contexto del idioma: guarda la elección en AsyncStorage (preferencia) y entrega la función t()
// para traducir los textos. Uso: t('home.available') o t('trip.commission', { percent: 20 }).
import { createContext, useCallback, useMemo } from 'react';
import usePersistentState from '../hooks/usePersistentState';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { TRANSLATIONS } from '../constants/translations';

export const LanguageContext = createContext(null);

// Busca un texto por su ruta, por ejemplo 'trip.status.paid'
const findText = (language, key) =>
  key.split('.').reduce((node, part) => (node ? node[part] : undefined), TRANSLATIONS[language]);

export function LanguageProvider({ children }) {
  const { value: language, update: setLanguage } = usePersistentState(STORAGE_KEYS.LANGUAGE, 'es');

  // Traduce una llave; si falta en inglés usa el español, y si falta en los dos devuelve la llave
  const t = useCallback(
    (key, params = {}) => {
      const text = findText(language, key) ?? findText('es', key) ?? key;
      return Object.entries(params).reduce(
        (result, [name, value]) => result.replace(`{${name}}`, String(value)),
        text
      );
    },
    [language]
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}