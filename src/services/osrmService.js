const BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

// origin y destination: { lat, lng }. Devuelve { distanceKm, durationMin }
export const getRouteSummary = async (origin, destination, signal) => {
  // OSRM pide las coordenadas en orden longitud,latitud
  const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `${BASE_URL}/${coordinates}?overview=false`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  const data = await response.json();
  const route = data.routes?.[0];
  if (data.code !== 'Ok' || !route) {
    throw new Error('No se encontró una ruta entre los dos puntos');
  }

  // Mapeo: OSRM entrega metros y segundos; la app usa km con un decimal y minutos enteros
  return {
    distanceKm: Math.round(route.distance / 100) / 10,
    durationMin: Math.max(1, Math.round(route.duration / 60)),
  };
};


// Consumo de la API gratuita OSRM (OpenStreetMap) para calcular distancia y duración de una ruta.
// Alternativa gratuita a Google Distance Matrix, acordada con la profesora.