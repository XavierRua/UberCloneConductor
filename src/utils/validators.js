// AI-assisted: see docs/AI_LOG.md #18
import {
  VEHICLE_CATEGORIES,
  GENDERS,
  VEHICLE_COLORS,
  LANGUAGES,
  MIN_XL_CAPACITY,
  TECHNICAL_REVIEW_FREE_YEARS,
  getValues,
} from '../constants/opcionesRegistro';

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/; // solo letras (con tildes y ñ) y espacios
const DIGITS_REGEX = /^\d+$/; // solo números
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // texto@dominio.algo
const PLATE_REGEX = /^[A-Z]{3}\d{3}$/; // placa colombiana de carro: ABC123
const REQUIRED_MESSAGE = 'Este campo es obligatorio';

// Ningún campo puede quedar nulo o vacío (regla del enunciado)
const isEmpty = (value) => value === null || value === undefined || String(value).trim() === '';

// Fecha de hoy a las 00:00, para comparar solo días y no horas
const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Fecha de mañana a las 00:00: el vencimiento debe ser posterior a hoy
const startOfTomorrow = () => {
  const tomorrow = startOfToday();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

// ---------- Validaciones por campo ----------

export const validateRequired = (value) => (isEmpty(value) ? REQUIRED_MESSAGE : '');

export const validateImage = (uri) => (isEmpty(uri) ? 'Debes agregar una foto' : '');

export const validateFullName = (value) => {
  if (isEmpty(value)) return REQUIRED_MESSAGE;
  const name = value.trim();
  if (name.length > 50) return 'Máximo 50 caracteres';
  if (!NAME_REGEX.test(name)) return 'Solo se permiten letras y espacios';
  return '';
};

export const validateDocumentId = (value) => {
  if (isEmpty(value)) return REQUIRED_MESSAGE;
  const document = value.trim();
  if (!DIGITS_REGEX.test(document)) return 'Solo se permiten números';
  if (document.length < 6 || document.length > 10) return 'Debe tener entre 6 y 10 dígitos';
  return '';
};

export const validatePhone = (value) => {
  if (isEmpty(value)) return REQUIRED_MESSAGE;
  const phone = value.trim();
  if (!DIGITS_REGEX.test(phone)) return 'Solo se permiten números';
  if (phone.length !== 10) return 'Debe tener 10 dígitos';
  return '';
};

export const validateBirthDate = (date) => {
  if (!(date instanceof Date)) return 'Selecciona tu fecha de nacimiento';
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const birthdayPending =
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());
  if (birthdayPending) age -= 1; // todavía no cumple años este año
  if (age < 18) return 'Debes ser mayor de 18 años';
  return '';
};

export const validateEmail = (value) => {
  if (isEmpty(value)) return REQUIRED_MESSAGE;
  if (!EMAIL_REGEX.test(value.trim())) return 'Correo no válido (ejemplo: nombre@dominio.com)';
  return '';
};

// Valida que el valor elegido exista en la lista de opciones
export const validateOption = (value, options) => {
  if (isEmpty(value)) return 'Selecciona una opción';
  if (!getValues(options).includes(value)) return 'Opción no válida';
  return '';
};

// La placa se convierte a mayúsculas antes de validar (regla del enunciado)
export const normalizePlate = (value) => (value || '').trim().toUpperCase();

export const validatePlate = (value) => {
  if (isEmpty(value)) return REQUIRED_MESSAGE;
  if (!PLATE_REGEX.test(normalizePlate(value))) return 'Formato no válido (ejemplo: ABC123)';
  return '';
};

export const validateMaxLength = (value, max) => {
  if (isEmpty(value)) return REQUIRED_MESSAGE;
  if (value.trim().length > max) return `Máximo ${max} caracteres`;
  return '';
};

export const validateYear = (value) => {
  if (isEmpty(value)) return REQUIRED_MESSAGE;
  const year = value.trim();
  if (!/^\d{4}$/.test(year)) return 'Debe tener 4 dígitos';
  if (Number(year) > new Date().getFullYear()) return 'No puede ser mayor al año actual';
  if (Number(year) < 1900) return 'Año no válido';
  return '';
};

export const validateCapacity = (value, category) => {
  if (isEmpty(value)) return REQUIRED_MESSAGE;
  const capacity = String(value).trim();
  if (!DIGITS_REGEX.test(capacity) || Number(capacity) < 1) return 'Debe ser un número mayor a 0';
  if (category === 'xl' && Number(capacity) < MIN_XL_CAPACITY) {
    return `La categoría XL exige mínimo ${MIN_XL_CAPACITY} pasajeros`;
  }
  return '';
};

// Fecha de vencimiento: debe ser posterior a hoy (si vence hoy, ya no es válida)
export const validateFutureDate = (date) => {
  if (!(date instanceof Date)) return 'Selecciona la fecha de vencimiento';
  if (date < startOfTomorrow()) return 'Debe ser posterior a hoy';
  return '';
};

export const validateLicenseNumber = (value) => {
  if (isEmpty(value)) return REQUIRED_MESSAGE;
  if (!DIGITS_REGEX.test(value.trim())) return 'Solo se permiten números';
  return '';
};

// La revisión técnico-mecánica aplica según la antigüedad del vehículo
export const requiresTechnicalReview = (year) => {
  if (!/^\d{4}$/.test(String(year))) return false;
  return new Date().getFullYear() - Number(year) >= TECHNICAL_REVIEW_FREE_YEARS;
};

// ---------- Validaciones por pestaña ----------

// Deja solo los campos que tienen error
const keepErrors = (errors) =>
  Object.fromEntries(Object.entries(errors).filter(([, message]) => message !== ''));

// Una pestaña es válida cuando no tiene ningún error
export const hasNoErrors = (errors) => Object.keys(errors).length === 0;

export const validatePersonalData = (data) =>
  keepErrors({
    profilePhoto: validateImage(data.profilePhoto),
    fullName: validateFullName(data.fullName),
    documentId: validateDocumentId(data.documentId),
    phone: validatePhone(data.phone),
    birthDate: validateBirthDate(data.birthDate),
    gender: validateOption(data.gender, GENDERS),
    email: validateEmail(data.email),
    language: validateOption(data.language, LANGUAGES),
  });

export const validateVehicle = (data) =>
  keepErrors({
    category: validateOption(data.category, VEHICLE_CATEGORIES),
    plate: validatePlate(data.plate),
    brand: validateMaxLength(data.brand, 30),
    model: validateMaxLength(data.model, 30),
    year: validateYear(data.year),
    color: validateOption(data.color, VEHICLE_COLORS),
    capacity: validateCapacity(data.capacity, data.category),
    vehiclePhoto: validateImage(data.vehiclePhoto),
  });

// vehicleYear se usa para saber si se exige la revisión técnico-mecánica
export const validateDocuments = (data, vehicleYear) => {
  const needsReview = requiresTechnicalReview(vehicleYear);
  return keepErrors({
    licenseNumber: validateLicenseNumber(data.licenseNumber),
    licensePhoto: validateImage(data.licensePhoto),
    licenseExpiry: validateFutureDate(data.licenseExpiry),
    soatPhoto: validateImage(data.soatPhoto),
    soatExpiry: validateFutureDate(data.soatExpiry),
    technicalReviewPhoto: needsReview ? validateImage(data.technicalReviewPhoto) : '',
    technicalReviewExpiry: needsReview ? validateFutureDate(data.technicalReviewExpiry) : '',
    mercadoPagoEmail: validateEmail(data.mercadoPagoEmail),
    termsAccepted: data.termsAccepted === true ? '' : 'Debes aceptar los términos',
  });
};


// Validaciones del registro del conductor .
// Cada función devuelve '' si el valor es válido, o el mensaje de error que se muestra debajo del campo.
// se rescribe una funcion validateFutureDate para que la fecha de vencimiento sea posterior a hoy (si vence hoy, ya no es válida)