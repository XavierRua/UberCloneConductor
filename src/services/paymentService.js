// AI-assisted: see docs/AI_LOG.md #N
// Comunicación con el backend de pagos. La app solo envía el tripId; la llave de Mercado Pago está en el backend.
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const TIMEOUT_MS = 15000; // si el backend no responde en 15 s, se cancela la petición

// Petición POST al backend con tiempo límite; si no es 2xx, lanza el error que devuelve el backend
const postToBackend = async (path, body) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal, // el mismo signal visto en clase para cancelar peticiones
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error ?? `Error HTTP ${response.status}`);
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError' || controller.signal.aborted) {
      throw new Error(
        `El backend no respondió en ${BACKEND_URL}. Revisa que esté encendido y que el celular esté en la misma red.`
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Pide al backend que cree la preferencia de Mercado Pago; devuelve { preferenceId, checkoutUrl }
export const createPaymentPreference = (tripId) => postToBackend('/payments/preference', { tripId });

// Pide al backend que busque el pago del viaje en Mercado Pago y actualice Firestore
export const verifyPayment = (tripId) => postToBackend('/payments/verify', { tripId });