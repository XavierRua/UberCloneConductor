

import { createContext, useCallback, useMemo, useState } from 'react';
import { validatePersonalData, validateVehicle, validateDocuments,hasNoErrors, } from '../utils/validators';

// Valores iniciales: todo vacío, excepto el idioma (español por defecto)
// AI-assisted: see docs/AI_LOG.md #19
const initialPersonalData = {
  profilePhoto: '',
  fullName: '',
  documentId: '',
  phone: '',
  birthDate: null,
  gender: '',
  email: '',
  language: 'es',
};

const initialVehicle = {
  category: '',
  plate: '',
  brand: '',
  model: '',
  year: '',
  color: '',
  capacity: '',
  vehiclePhoto: '',
};

const initialDocuments = {
  licenseNumber: '',
  licensePhoto: '',
  licenseExpiry: null,
  soatPhoto: '',
  soatExpiry: null,
  technicalReviewPhoto: '',
  technicalReviewExpiry: null,
  mercadoPagoEmail: '',
  termsAccepted: false,
};

// carpeta compartida   
export const RegisterContext = createContext(null);

export function RegisterProvider({ children }) {
  const [personalData, setPersonalData] = useState(initialPersonalData);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [documents, setDocuments] = useState(initialDocuments);

  // Actualizan un solo campo sin borrar los demás
  const updatePersonalData = useCallback((field, value) => {
    setPersonalData((current) => ({ ...current, [field]: value }));
  }, []);

  const updateVehicle = useCallback((field, value) => {
    setVehicle((current) => ({ ...current, [field]: value }));
  }, []);

  const updateDocuments = useCallback((field, value) => {
    setDocuments((current) => ({ ...current, [field]: value }));
  }, []);

  // Deja el formulario vacío (por ejemplo, después de registrar o eliminar el usuario)
  const resetRegister = useCallback(() => {
    setPersonalData(initialPersonalData);
    setVehicle(initialVehicle);
    setDocuments(initialDocuments);
  }, []);

  // Errores de cada pestaña; se recalculan solo cuando cambian los datos
  const errors = useMemo(
    () => ({
      personalData: validatePersonalData(personalData),
      vehicle: validateVehicle(vehicle),
      documents: validateDocuments(documents, vehicle.year),
    }),
    [personalData, vehicle, documents]
  );

  // Una pestaña es válida cuando no tiene errores
  const tabsValid = useMemo(
    () => ({
      personalData: hasNoErrors(errors.personalData),
      vehicle: hasNoErrors(errors.vehicle),
      documents: hasNoErrors(errors.documents),
    }),
    [errors]
  );

  // El botón Enviar registro solo se habilita con las tres pestañas válidas
  const canSubmit = tabsValid.personalData && tabsValid.vehicle && tabsValid.documents;

  const value = useMemo(
    () => ({
      personalData,
      vehicle,
      documents,
      errors,
      tabsValid,
      canSubmit,
      updatePersonalData,
      updateVehicle,
      updateDocuments,
      resetRegister,
    }),
    [
      personalData,
      vehicle,
      documents,
      errors,
      tabsValid,
      canSubmit,
      updatePersonalData,
      updateVehicle,
      updateDocuments,
      resetRegister,
    ]
  );

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
}


// Contexto del registro: guarda lo que el conductor escribe en las tres pestañas
// mientras pasa de una a otra, y calcula los errores de cada pestaña.
// Los datos NO se guardan en AsyncStorage porque incluyen datos personales (regla del enunciado).