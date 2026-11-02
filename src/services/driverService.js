// AI-assisted: see docs/AI_LOG.md #32

import { deleteDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { normalizePlate, requiresTechnicalReview } from '../utils/validators';
import { COMMISSION_RATE } from '../config/pricing';

const COLLECTION = 'drivers';


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
  
    photos: null,
    
    approvalStatus: 'pending',
    createdAt: serverTimestamp(),
  };
};


export const getDriver = async (phone) => {
  const snapshot = await getDoc(doc(db, COLLECTION, phone));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};


export const phoneExists = async (phone) => (await getDriver(phone)) !== null;

// El celular es el ID del documento, igual que idMeal en el ejemplo de clase
export const createDriver = async (personalData, vehicle, documents) => {
  const driver = buildDriverDocument(personalData, vehicle, documents);
  await setDoc(doc(db, COLLECTION, driver.phone), driver);
  return driver.phone;
};

// AI-assisted: see docs/AI_LOG.md #38
// Elimina al conductor y comprueba que en la base de datos no quede nada.


export const deleteDriver = async (phone) => {
  await deleteDoc(doc(db, COLLECTION, phone));

  // Verificación: el documento ya no debe existir
  if (await phoneExists(phone)) {
    throw new Error('El conductor no se eliminó por completo. Intenta de nuevo.');
  }
};

// Servicio de conductores en Firestore: colección drivers, un documento por celular.
// Servicio de conductores en Firestore: colección drivers, un documento por celular.