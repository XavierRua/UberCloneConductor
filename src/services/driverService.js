
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { normalizePlate, requiresTechnicalReview } from '../utils/validators';
import { COMMISSION_RATE } from '../config/pricing';
import { deleteTripsByDriver } from './tripService';

const COLLECTION = 'drivers';

// Arma el documento de Firestore a partir de las tres pestañas del registro y las fotos subidas
const buildDriverDocument = (personalData, vehicle, documents, photos) => {
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
    // URL y publicId de cada foto en Cloudinary: { profile, vehicle, license, soat, technicalReview? }
    photos,
    // pending = Pendiente de aprobación; se aprueba cambiando este campo en la base de datos
    approvalStatus: 'pending',
    // Disponibilidad y última ubicación: se actualizan desde la pantalla de Inicio
    isAvailable: false,
    location: null,
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
export const createDriver = async (personalData, vehicle, documents, photos) => {
  const driver = buildDriverDocument(personalData, vehicle, documents, photos);
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

// Cambia el estado Disponible / No disponible del conductor
export const updateDriverAvailability = async (phone, isAvailable) => {
  await updateDoc(doc(db, COLLECTION, phone), {
    isAvailable,
    availabilityUpdatedAt: serverTimestamp(),
  });
};

// Guarda la última ubicación del conductor (se llama cada pocos segundos mientras está Disponible)
export const updateDriverLocation = async (phone, { latitude, longitude }) => {
  await updateDoc(doc(db, COLLECTION, phone), {
    location: { lat: latitude, lng: longitude },
    locationUpdatedAt: serverTimestamp(),
  });
};

// Guarda el idioma elegido en Configuración (dato editable del perfil del conductor)
export const updateDriverLanguage = async (phone, language) => {
  await updateDoc(doc(db, COLLECTION, phone), { language });
};

// AI-assisted: see docs/AI_LOG.md #23
// Elimina al conductor y sus viajes, y comprueba que en la base de datos no quede nada.
// Las imágenes en Cloudinary solo se pueden borrar con la API Secret, que no puede ir en la app;
// su borrado queda para el backend del proyecto.
export const deleteDriver = async (phone) => {
  await deleteTripsByDriver(phone); // primero los viajes (colección trips)
  await deleteDoc(doc(db, COLLECTION, phone));

  // Verificación: el documento ya no debe existir
  if (await phoneExists(phone)) {
    throw new Error('El conductor no se eliminó por completo. Intenta de nuevo.');
  }
};