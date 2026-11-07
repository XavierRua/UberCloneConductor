import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import calculateFare from '../utils/calculateFare';
import { COMMISSION_RATE } from '../config/pricing';
import { getRoute, getRouteSummary } from './osrmService';

const COLLECTION = 'trips';

// Estados de un viaje (sección 3 del enunciado); controlan qué se muestra en pantalla
export const TRIP_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DRIVER_ARRIVING: 'driver_arriving',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
};

// Estados en los que el viaje sigue activo para el conductor
const ACTIVE_STATUSES = [
  TRIP_STATUS.ACCEPTED,
  TRIP_STATUS.DRIVER_ARRIVING,
  TRIP_STATUS.IN_PROGRESS,
  TRIP_STATUS.COMPLETED,
  TRIP_STATUS.PAID,
];

// Lugares de Medellín para simular solicitudes mientras la profesora entrega su backend
const SAMPLE_PLACES = [
  { lat: 6.2088, lng: -75.5675, address: 'Parque Lleras, El Poblado' },
  { lat: 6.2567, lng: -75.5903, address: 'Estadio Atanasio Girardot' },
  { lat: 6.2207, lng: -75.5906, address: 'Aeropuerto Olaya Herrera' },
  { lat: 6.1965, lng: -75.5743, address: 'Centro Comercial Santafé' },
  { lat: 6.2524, lng: -75.5687, address: 'Plaza Botero, Centro' },
  { lat: 6.2672, lng: -75.5688, address: 'Universidad de Antioquia' },
  { lat: 6.2302, lng: -75.6035, address: 'Universidad de Medellín' },
  { lat: 6.2393, lng: -75.5794, address: 'Parque de los Deseos' },
];

const PAYMENT_METHODS = ['cash', 'mercadopago'];
const SIMULATED_TIPS = [0, 0, 1000, 2000]; // la mitad de los viajes simulados sin propina

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

// Distancia en línea recta entre dos puntos (respaldo si OSRM no responde)
const straightLineKm = (a, b) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
};

// Distancia y duración: OSRM una sola vez al crear la solicitud (recomendación del enunciado)
const estimateRoute = async (origin, destination) => {
  try {
    return await getRouteSummary(origin, destination);
  } catch (error) {
    // Respaldo aproximado: la vía es ~30 % más larga que la línea recta, a 25 km/h en ciudad
    const distanceKm = Math.round(straightLineKm(origin, destination) * 1.3 * 10) / 10;
    return { distanceKm, durationMin: Math.max(1, Math.round((distanceKm / 25) * 60)) };
  }
};

// Crea una solicitud de viaje de prueba para el conductor (temporal, hasta tener el backend)
export const createSimulatedTrip = async (driver) => {
  const origin = { ...pickRandom(SAMPLE_PLACES) };
  let destination = { ...pickRandom(SAMPLE_PLACES) };
  while (destination.address === origin.address) {
    destination = { ...pickRandom(SAMPLE_PLACES) };
  }

  const { distanceKm, durationMin } = await estimateRoute(origin, destination);
  const category = driver.vehicle.category;
  const estimate = calculateFare({ distanceKm, durationMin, category });

  const tripRef = await addDoc(collection(db, COLLECTION), {
    driverId: driver.phone,
    passengerId: 'simulated-passenger',
    origin,
    destination,
    distanceKm,
    durationMin,
    category,
    paymentMethod: pickRandom(PAYMENT_METHODS),
    estimatedFare: estimate.fare,
    estimatedEarnings: estimate.driverEarnings,
    commissionRate: COMMISSION_RATE, // se guarda para que un cambio futuro no altere el historial
    simulatedTip: pickRandom(SIMULATED_TIPS),
    status: TRIP_STATUS.REQUESTED,
    isSimulated: true,
    driverClosed: false,
    createdAt: serverTimestamp(),
  });

  return tripRef.id;
};

// Escucha en tiempo real las solicitudes pendientes de un conductor (la más antigua primero)
export const subscribeToTripRequests = (driverPhone, onChange, onError) => {
  const requestsQuery = query(
    collection(db, COLLECTION),
    where('driverId', '==', driverPhone),
    where('status', '==', TRIP_STATUS.REQUESTED)
  );

  return onSnapshot(
    requestsQuery,
    (snapshot) => {
      const trips = snapshot.docs.map((tripDoc) => ({ id: tripDoc.id, ...tripDoc.data() }));
      const timeOf = (trip) => trip.createdAt?.toMillis?.() ?? Date.now();
      trips.sort((a, b) => timeOf(a) - timeOf(b));
      onChange(trips);
    },
    onError
  );
};

// Escucha en tiempo real el viaje activo del conductor (o null si no tiene)
export const subscribeToActiveTrip = (driverPhone, onChange, onError) => {
  const activeQuery = query(
    collection(db, COLLECTION),
    where('driverId', '==', driverPhone),
    where('status', 'in', ACTIVE_STATUSES)
  );

  return onSnapshot(
    activeQuery,
    (snapshot) => {
      const trips = snapshot.docs
        .map((tripDoc) => ({ id: tripDoc.id, ...tripDoc.data() }))
        .filter((trip) => trip.driverClosed !== true); // el resumen ya cerrado no se muestra
      const timeOf = (trip) => trip.acceptedAt?.toMillis?.() ?? Date.now();
      trips.sort((a, b) => timeOf(b) - timeOf(a));
      onChange(trips[0] ?? null);
    },
    onError
  );
};

// accepted: el conductor acepta la solicitud
export const acceptTrip = async (tripId) => {
  await updateDoc(doc(db, COLLECTION, tripId), {
    status: TRIP_STATUS.ACCEPTED,
    acceptedAt: serverTimestamp(),
  });
};

// rejected: el conductor rechaza o se vence el tiempo (reason: 'driver' | 'timeout')
export const rejectTrip = async (tripId, reason) => {
  await updateDoc(doc(db, COLLECTION, tripId), {
    status: TRIP_STATUS.REJECTED,
    rejectionReason: reason,
    rejectedAt: serverTimestamp(),
  });
};

// driver_arriving: el conductor va hacia el punto de recogida
export const startPickup = async (tripId) => {
  await updateDoc(doc(db, COLLECTION, tripId), {
    status: TRIP_STATUS.DRIVER_ARRIVING,
    pickupStartedAt: serverTimestamp(),
  });
};

// in_progress: el pasajero está a bordo; se guarda la ruta para dibujarla en el historial
export const startTrip = async (trip) => {
  const route = await getRoute(trip.origin, trip.destination).catch(() => null);
  await updateDoc(doc(db, COLLECTION, trip.id), {
    status: TRIP_STATUS.IN_PROGRESS,
    startedAt: serverTimestamp(),
    route: route?.coordinates ?? null,
  });
};

// completed: se calcula la tarifa final con la misma función de la estimación (enunciado, sección 4)
export const completeTrip = async (trip) => {
  const tip = trip.simulatedTip ?? 0;
  const { fare, commission, driverEarnings } = calculateFare({
    distanceKm: trip.distanceKm,
    durationMin: trip.durationMin,
    category: trip.category,
    tip,
    commissionRate: trip.commissionRate ?? COMMISSION_RATE,
  });

  await updateDoc(doc(db, COLLECTION, trip.id), {
    status: TRIP_STATUS.COMPLETED,
    fare,
    commission,
    tip,
    driverEarnings,
    paymentStatus: 'pending',
    completedAt: serverTimestamp(),
  });
};

// Calificación del pasajero simulada (4 o 5 estrellas) mientras no existe la app del pasajero
const simulatedRating = () => 4 + Math.round(Math.random());

// paid: el conductor marca el cobro en efectivo como recibido
export const confirmCashPayment = async (tripId) => {
  await updateDoc(doc(db, COLLECTION, tripId), {
    status: TRIP_STATUS.PAID,
    paymentStatus: 'cash',
    paidAt: serverTimestamp(),
    rating: simulatedRating(),
  });
};

// Temporal hasta conectar Mercado Pago: simula la respuesta de la pasarela
export const simulateOnlinePayment = async (tripId, approved) => {
  if (!approved) {
    await updateDoc(doc(db, COLLECTION, tripId), { paymentStatus: 'rejected' });
    return;
  }
  await updateDoc(doc(db, COLLECTION, tripId), {
    status: TRIP_STATUS.PAID,
    paymentStatus: 'approved',
    paymentId: `SIMULATED-${Date.now()}`,
    paidAt: serverTimestamp(),
    rating: simulatedRating(),
  });
};

// cancelled: cancelado por el conductor antes de in_progress
export const cancelTrip = async (tripId) => {
  await updateDoc(doc(db, COLLECTION, tripId), {
    status: TRIP_STATUS.CANCELLED,
    cancelledBy: 'driver',
    cancelledAt: serverTimestamp(),
    driverClosed: true,
  });
};

// El conductor cierra el resumen del viaje pagado
export const closeTripSummary = async (tripId) => {
  await updateDoc(doc(db, COLLECTION, tripId), { driverClosed: true });
};

// Borra todos los viajes de un conductor (se usa al eliminar el usuario)
export const deleteTripsByDriver = async (driverPhone) => {
  const snapshot = await getDocs(query(collection(db, COLLECTION), where('driverId', '==', driverPhone)));
  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.docs.forEach((tripDoc) => batch.delete(tripDoc.ref));
  await batch.commit();
};

// ---------- Historial y ganancias: see docs/AI_LOG.md #N ----------

// Viajes por carga en el historial (enunciado: paginar o limitar la consulta)
export const HISTORY_PAGE_SIZE = 20;

// Un viaje por su ID (para la pantalla de detalle)
export const getTrip = async (tripId) => {
  const snapshot = await getDoc(doc(db, COLLECTION, tripId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

// Una página del historial: viajes pagados del más reciente al más antiguo, con filtro de fechas.
// cursor es el último documento de la página anterior (para "Cargar más").
// Requiere el índice compuesto: driverId (asc), status (asc), completedAt (desc).
export const getTripHistoryPage = async (driverPhone, { from = null, to = null, cursor = null } = {}) => {
  const constraints = [
    where('driverId', '==', driverPhone),
    where('status', '==', TRIP_STATUS.PAID),
  ];
  if (from) constraints.push(where('completedAt', '>=', from));
  if (to) constraints.push(where('completedAt', '<=', to));
  constraints.push(orderBy('completedAt', 'desc'), limit(HISTORY_PAGE_SIZE));
  if (cursor) constraints.push(startAfter(cursor));

  const snapshot = await getDocs(query(collection(db, COLLECTION), ...constraints));

  return {
    trips: snapshot.docs.map((tripDoc) => ({ id: tripDoc.id, ...tripDoc.data() })),
    cursor: snapshot.docs[snapshot.docs.length - 1] ?? null,
    hasMore: snapshot.docs.length === HISTORY_PAGE_SIZE,
  };
};

// Todos los viajes pagados del conductor, en tiempo real (para las ganancias y el saldo)
export const subscribeToPaidTrips = (driverPhone, onChange, onError) => {
  const paidQuery = query(
    collection(db, COLLECTION),
    where('driverId', '==', driverPhone),
    where('status', '==', TRIP_STATUS.PAID)
  );

  return onSnapshot(
    paidQuery,
    (snapshot) => onChange(snapshot.docs.map((tripDoc) => ({ id: tripDoc.id, ...tripDoc.data() }))),
    onError
  );
};


// Servicio de viajes en Firestore: colección trips (modelo de datos de la sección 6 del enunciado).