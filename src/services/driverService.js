// AI-assisted: see docs/AI_LOG.md #32
// AI-assisted: see docs/AI_LOG.md #40

import { deleteDoc, doc, getDoc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { normalizePlate, requiresTechnicalReview } from '../utils/validators';
import { COMMISSION_RATE } from '../config/pricing';

const COLLECTION = 'drivers';

// Arma el documento de Firestore a partir de las tres pestañas del registro
const buildDriverDocument = (personalData, vehicle, documents) => {
  const needsReview = requiresTechnicalReview(vehicle.year);

  return {
    fullName: personalData.fullName.trim(),
    documentId: personalData.documentId.trim(),
    phone: personalData.phone.trim(),
    birthDate: personalData.birthDate,
    gender: personalData.gender,
    email: personalData.email.trim().toLowerCase(),
    language: personalData.language,
    vehicle: {
      category: vehicle.category,
      plate: normalizePlate(vehicle.plate),
      brand: vehicle.brand.trim(),
      model: vehicle.model.trim(),
      year: Number(vehicle.year),
      color: vehicle.color,
      capacity: Number(vehicle.capacity),
    },
    documents: {
      licenseNumber: documents.licenseNumber.trim(),
      licenseExpiry: documents.licenseExpiry,
      soatExpiry: documents.soatExpiry,
      technicalReviewExpiry: needsReview ? documents.technicalReviewExpiry : null,
      mercadoPagoEmail: documents.mercadoPagoEmail.trim().toLowerCase(),
      termsAccepted: true,
      commissionRate: COMMISSION_RATE, // comisión aceptada al registrarse
    },
    // Pendiente: subida de fotos (avance 10). Aquí irán las URL de Storage.
    photos: null,
    // pending = Pendiente de aprobación; se aprueba cambiando este campo en la base de datos
    approvalStatus: 'pending',
    createdAt: serverTimestamp(),
  };
};

// Convierte la "foto" de Firestore en un objeto, o null si el documento no existe
const toDriver = (snapshot) => (snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);

// Busca un conductor por su celular (una sola lectura)
export const getDriver = async (phone) => toDriver(await getDoc(doc(db, COLLECTION, phone)));

// Regla: un solo conductor por celular
export const phoneExists = async (phone) => (await getDriver(phone)) !== null;

// El celular es el ID del documento, igual que idMeal en el ejemplo de clase
export const createDriver = async (personalData, vehicle, documents) => {
  const driver = buildDriverDocument(personalData, vehicle, documents);
  await setDoc(doc(db, COLLECTION, driver.phone), driver);
  return driver.phone;
};

// Escucha al conductor en tiempo real: cada cambio en Firestore llama a onChange.
// Devuelve la función para dejar de escuchar (se usa en la limpieza del useEffect).
export const subscribeToDriver = (phone, onChange, onError) =>
  onSnapshot(
    doc(db, COLLECTION, phone),
    (snapshot) => onChange(toDriver(snapshot)),
    onError
  );

// AI-assisted: see docs/AI_LOG.md #23
// Elimina al conductor y comprueba que en la base de datos no quede nada.
// Pendiente (avance 10): borrar también sus fotos de Storage (carpeta drivers/{celular}).
// Nota: deleteDoc no borra subcolecciones; si en la segunda entrega se agregan (por ejemplo, viajes),
// habrá que borrarlas aquí también.
export const deleteDriver = async (phone) => {
  await deleteDoc(doc(db, COLLECTION, phone));

  // Verificación: el documento ya no debe existir
  if (await phoneExists(phone)) {
    throw new Error('El conductor no se eliminó por completo. Intenta de nuevo.');
  }
};

// Servicio de conductores en Firestore: colección drivers, un documento por celular.
// Servicio de conductores en Firestore: colección drivers, un documento por celular.