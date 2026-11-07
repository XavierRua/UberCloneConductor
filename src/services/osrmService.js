const BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

// overview 'false' = solo distancia y duración; 'simplified' = también la línea de la ruta
const buildUrl = (origin, destination, overview) => {
  // OSRM pide las coordenadas en orden longitud,latitud
  const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const geometry = overview === 'false' ? '' : '&geometries=geojson';
  return `${BASE_URL}/${coordinates}?overview=${overview}${geometry}`;
};

// Petición común: valida la respuesta igual que en el ejemplo de clase
const fetchRoute = async (url, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }
  const data = await response.json();
  const route = data.routes?.[0];
  if (data.code !== 'Ok' || !route) {
    throw new Error('No se encontró una ruta entre los dos puntos');
  }
  return route;
};

// Mapeo: OSRM entrega metros y segundos; la app usa km con un decimal y minutos enteros
const toSummary = (route) => ({
  distanceKm: Math.round(route.distance / 100) / 10,
  durationMin: Math.max(1, Math.round(route.duration / 60)),
});

// Solo distancia y duración (al crear la solicitud)
export const getRouteSummary = async (origin, destination, signal) =>
  toSummary(await fetchRoute(buildUrl(origin, destination, 'false'), signal));

// Distancia, duración y puntos de la ruta para dibujarla con Polyline
export const getRoute = async (origin, destination, signal) => {
  const route = await fetchRoute(buildUrl(origin, destination, 'simplified'), signal);
  return {
    ...toSummary(route),
    coordinates: route.geometry.coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
  };
};

// Consumo de la API gratuita OSRM (OpenStreetMap): distancia, duración y ruta para dibujar en el mapa.
// Alternativa gratuita a Google Distance Matrix y Directions
