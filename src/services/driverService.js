// AI-assisted: see docs/AI_LOG.md #32

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
      commissionRate: COMMISSION_RATE, 
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


export const createDriver = async (personalData, vehicle, documents) => {
  const driver = buildDriverDocument(personalData, vehicle, documents);
  await setDoc(doc(db, COLLECTION, driver.phone), driver);
  return driver.phone;
};

// Servicio de conductores en Firestore: colección drivers, un documento por celular.