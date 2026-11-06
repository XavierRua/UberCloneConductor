
const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Convierte la respuesta de texto en JSON sin romper la app si llega algo inesperado
const parseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

// Sube una foto (ruta local del celular) y devuelve su URL pública y su identificador en Cloudinary
export const uploadImage = (uri, fileName) =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', { uri, type: 'image/jpeg', name: `${fileName}.jpg` });
    formData.append('upload_preset', UPLOAD_PRESET);

    const request = new XMLHttpRequest();
    request.open('POST', UPLOAD_URL);

    // Respuesta del servidor: igual que en la clase, solo los códigos 2xx son éxito
    request.onload = () => {
      const data = parseJson(request.responseText);
      if (request.status >= 200 && request.status < 300 && data) {
        resolve({ url: data.secure_url, publicId: data.public_id });
      } else {
        reject(new Error(data?.error?.message ?? `Error HTTP ${request.status}`));
      }
    };

    // Error de red: sin internet o sin conexión con Cloudinary
    request.onerror = () => reject(new Error('No se pudo conectar con Cloudinary'));

    request.send(formData);
  });

// Sube todas las fotos del conductor, una por una, e informa el progreso.
// photoUris: { profile: 'file:///...', vehicle: 'file:///...', ... }; las vacías se omiten.
export const uploadDriverPhotos = async (photoUris, onProgress) => {
  const entries = Object.entries(photoUris).filter(([, uri]) => Boolean(uri));
  const photos = {};

  for (let index = 0; index < entries.length; index += 1) {
    const [key, uri] = entries[index];
    if (onProgress) onProgress(index + 1, entries.length);
    photos[key] = await uploadImage(uri, key);
  }

  return photos; // { profile: { url, publicId }, vehicle: { url, publicId }, ... }
};