// AI-assisted: see docs/AI_LOG.md #N
// Backend de pagos (Node.js + Express): crea la preferencia de Mercado Pago Checkout Pro y recibe
// el resultado del pago para actualizar el viaje en Firestore (sección 4 del enunciado).
// El access_token de Mercado Pago vive solo aquí, en el .env del backend; nunca en la app.
// Verificación del pago por external_reference: see docs/AI_LOG.md #N
require('dotenv').config();
const express = require('express');
const { initializeApp } = require('firebase/app');
const { initializeFirestore, doc, getDoc, updateDoc, serverTimestamp } = require('firebase/firestore');

const {
  PORT = 3000,
  PUBLIC_BASE_URL,
  MP_ACCESS_TOKEN,
  MP_USE_SANDBOX = 'true',
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_APP_ID,
} = process.env;

const MP_API = 'https://api.mercadopago.com';

// Conexión con el mismo proyecto de Firebase de la app
const firebaseApp = initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  appId: FIREBASE_APP_ID,
});

// En Node, la conexión por "long polling" evita el error "the client is offline" en algunas redes
const db = initializeFirestore(firebaseApp, { experimentalForceLongPolling: true });

// Verificación al arrancar: si sale "undefined", el .env del backend no se está leyendo bien
console.log(`Proyecto de Firebase: ${FIREBASE_PROJECT_ID}`);
console.log(`Dirección pública del backend: ${PUBLIC_BASE_URL}`);
console.log(`Access token de Mercado Pago cargado: ${MP_ACCESS_TOKEN ? 'sí' : 'NO'}`);

const app = express();
app.use(express.json());

// Registro de cada petición que llega (para diagnosticar la conexión con la app)
app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} ${req.url}`);
  next();
});

// Petición a la API de Mercado Pago con la llave secreta; si no es 2xx, lanza un error
const mpRequest = async (path, options = {}) => {
  const response = await fetch(`${MP_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Error HTTP ${response.status}`);
  }
  return data;
};

// Página sencilla que ve el pasajero al terminar el pago
const resultPage = (title, message) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title></head>
<body style="font-family:sans-serif;text-align:center;padding:40px">
<h1>${title}</h1><p>${message}</p></body></html>`;

// Guarda en Firestore el resultado de un pago de Mercado Pago (paso 5 del enunciado)
const applyPaymentResult = async (tripId, payment) => {
  let paymentStatus = 'pending';
  if (payment.status === 'approved') paymentStatus = 'approved';
  if (payment.status === 'rejected') paymentStatus = 'rejected';

  const update = { paymentStatus, paymentId: String(payment.id) };
  if (paymentStatus === 'approved') {
    update.status = 'paid';
    update.paidAt = serverTimestamp();
    update.rating = 4 + Math.round(Math.random()); // calificación simulada hasta tener la app del pasajero
  }
  await updateDoc(doc(db, 'trips', tripId), update);
  return paymentStatus;
};

// Prueba de conexión: abrir http://TU_IP:3000/health en el navegador del celular
app.get('/health', (req, res) => res.json({ ok: true }));

// Pasos 2 y 3: la app envía el tripId; el backend crea la preferencia con la tarifa guardada en Firestore
app.post('/payments/preference', async (req, res) => {
  try {
    const { tripId } = req.body;
    if (!tripId) return res.status(400).json({ error: 'Falta el tripId' });

    const tripRef = doc(db, 'trips', tripId);
    const snapshot = await getDoc(tripRef);
    if (!snapshot.exists()) return res.status(404).json({ error: 'El viaje no existe' });

    const trip = snapshot.data();
    if (trip.status !== 'completed') {
      return res.status(409).json({ error: 'El viaje todavía no está listo para cobrar' });
    }

    // El monto sale de Firestore, no de la app, para que nadie pueda cambiarlo desde el celular
    const preference = await mpRequest('/checkout/preferences', {
      method: 'POST',
      body: JSON.stringify({
        items: [
          {
            title: `Viaje: ${trip.origin.address} → ${trip.destination.address}`,
            quantity: 1,
            unit_price: trip.fare,
            currency_id: 'COP',
          },
        ],
        external_reference: tripId,
        back_urls: {
          success: `${PUBLIC_BASE_URL}/payments/return`,
          failure: `${PUBLIC_BASE_URL}/payments/return`,
          pending: `${PUBLIC_BASE_URL}/payments/return`,
        },
      }),
    });

    await updateDoc(tripRef, { paymentStatus: 'pending', paymentPreferenceId: preference.id });

    const checkoutUrl =
      MP_USE_SANDBOX === 'true' ? preference.sandbox_init_point : preference.init_point;

    // 201: se creó un recurso nuevo (la preferencia de pago)
    return res.status(201).json({ preferenceId: preference.id, checkoutUrl });
  } catch (error) {
    console.error('Error al crear la preferencia:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Paso 5 (opción A): Mercado Pago redirige aquí al terminar el pago (URL de retorno)
app.get('/payments/return', async (req, res) => {
  const paymentId = req.query.payment_id || req.query.collection_id;
  const tripId = req.query.external_reference;

  try {
    if (!paymentId || paymentId === 'null' || !tripId) {
      return res.send(resultPage('Pago no completado', 'Vuelve a la app para intentarlo de nuevo.'));
    }

    // Se consulta el pago directamente a Mercado Pago: no se confía en los datos de la URL
    const payment = await mpRequest(`/v1/payments/${paymentId}`);
    if (payment.external_reference !== tripId) {
      throw new Error('El pago no corresponde a este viaje');
    }

    const paymentStatus = await applyPaymentResult(tripId, payment);
    console.log(`Pago ${payment.id} del viaje ${tripId}: ${paymentStatus} (URL de retorno)`);

    const titles = {
      approved: 'Pago aprobado',
      rejected: 'Pago rechazado',
      pending: 'Pago pendiente',
    };
    return res.send(resultPage(titles[paymentStatus], 'Ya puedes volver a la app del conductor.'));
  } catch (error) {
    console.error('Error al procesar el pago:', error.message);
    return res.status(500).send(resultPage('Error', error.message));
  }
});

// Paso 5 (opción B): la app pide verificar el pago; se busca en Mercado Pago por external_reference
app.post('/payments/verify', async (req, res) => {
  try {
    const { tripId } = req.body;
    if (!tripId) return res.status(400).json({ error: 'Falta el tripId' });

    const search = await mpRequest(
      `/v1/payments/search?external_reference=${encodeURIComponent(tripId)}&sort=date_created&criteria=desc`
    );
    const payments = search.results ?? [];

    // Si hay varios intentos, manda el aprobado; si no, el más reciente
    const payment = payments.find((item) => item.status === 'approved') ?? payments[0];
    if (!payment) {
      return res.json({ paymentStatus: 'pending', message: 'Todavía no hay pagos para este viaje' });
    }

    const paymentStatus = await applyPaymentResult(tripId, payment);
    console.log(`Pago ${payment.id} del viaje ${tripId}: ${paymentStatus} (verificación)`);
    return res.json({ paymentStatus, paymentId: String(payment.id) });
  } catch (error) {
    console.error('Error al verificar el pago:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend de pagos escuchando en el puerto ${PORT}`);
});