// AI-assisted: see docs/AI_LOG.md #16 - #17
// Opciones de las listas desplegables del registro y reglas fijas del vehículo.
// value: lo que se guarda en la base de datos (en inglés). label: lo que ve el conductor.

export const VEHICLE_CATEGORIES = [
  { value: 'economy', label: 'Económico' },
  { value: 'xl', label: 'XL' },
  { value: 'premium', label: 'Premium' },
];

export const GENDERS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' },
  { value: 'undisclosed', label: 'Prefiero no decirlo' },
];

export const VEHICLE_COLORS = [
  { value: 'white', label: 'Blanco' },
  { value: 'black', label: 'Negro' },
  { value: 'gray', label: 'Gris' },
  { value: 'silver', label: 'Plateado' },
  { value: 'red', label: 'Rojo' },
  { value: 'blue', label: 'Azul' },
  { value: 'other', label: 'Otro' },
];

export const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
];

// Capacidad mínima de pasajeros para la categoría XL (enunciado, pestaña Vehículo)
export const MIN_XL_CAPACITY = 6;

// Años de antigüedad desde los que se exige la revisión técnico-mecánica (vehículo particular en Colombia)
export const TECHNICAL_REVIEW_FREE_YEARS = 5;

// Solo los valores, para validar que lo elegido exista en la lista
export const getValues = (options) => options.map((option) => option.value);