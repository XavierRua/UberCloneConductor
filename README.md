# UberClone — Versión Conductor

Aplicación móvil multiplataforma inspirada en Uber, en su versión para el **conductor**, construida con **React Native y Expo** para Android e iOS. Proyecto de la asignatura **Desarrollo Móvil**.

El conductor se registra con sus datos personales, los de su vehículo y sus documentos; la cuenta queda **pendiente de aprobación**. Una vez aprobado, se pone **Disponible**, recibe **solicitudes de viaje** con un tiempo límite para aceptarlas, navega hasta el pasajero y hasta el destino, **cobra en efectivo o con Mercado Pago** (modo de prueba) y consulta su **historial** y sus **ganancias** netas después de la comisión de la plataforma.

## Funcionalidades

### Registro y cuenta
- Registro en **tres pestañas** (Datos personales, Vehículo, Documentos) con todas las validaciones del enunciado y el error debajo de cada campo.
- Botón **Enviar registro** habilitado solo cuando las tres pestañas están completas y válidas.
- Fotos de perfil, vehículo y documentos desde la **cámara o la galería**, guardadas en **Cloudinary**.
- Un solo conductor por número de celular.
- Cuenta en estado **Pendiente de aprobación**; el cambio a **Aprobado** se refleja en el celular **en tiempo real**.
- **Iniciar sesión** con el celular, **Cerrar sesión** y **Eliminar usuario** (borra el conductor y sus viajes de Firestore).

### Viajes
- Mapa con la ubicación del conductor e interruptor **Disponible / No disponible**, bloqueado mientras la cuenta no esté aprobada.
- Mientras está Disponible, la ubicación se envía a Firestore **cada 5 segundos**; al pasar a No disponible o salir de la pantalla, el seguimiento se detiene.
- **Solicitudes en tiempo real** con origen, destino, distancia, duración, categoría, método de pago, tarifa y ganancia estimadas, y **temporizador de 15 segundos** con rechazo automático.
- Ruta hacia el punto de recogida y hacia el destino dibujada en el mapa con **OSRM**.
- Estados del viaje: `requested → accepted → driver_arriving → in_progress → completed → paid`, y `cancelled` / `rejected`.

### Cobro, ganancias e historial
- Tarifa, comisión del 20 % y ganancia neta calculadas con una sola función pura, **`calculateFare`**, usada en la estimación y en el cierre del viaje.
- Cobro en **efectivo** o con **Mercado Pago Checkout Pro** en modo de prueba, a través de un **backend propio** en Node.js/Express.
- **Ganancias** de hoy, la semana y el mes (viajes, total facturado, comisiones, propinas, ganancia neta y promedio) y **saldo** del conductor.
- **Historial** con filtros (Todos, Hoy, Semana, Mes, Rango de fechas y método de pago), paginación de 20 viajes por carga y **detalle** con la ruta guardada.

### Otros
- Navegación combinada: **Stack**, **Tabs** (registro) y **Drawer** (Inicio, Mi perfil, Historial, Ganancias, Configuración).
- Idioma **español / inglés**, guardado como preferencia en el dispositivo.

## Tecnologías

| Área | Herramienta |
|---|---|
| App | **Expo SDK 58**, React Native, React |
| Navegación | React Navigation: native-stack, bottom-tabs y drawer |
| Base de datos | **Cloud Firestore** (tiempo real con `onSnapshot`) |
| Imágenes | **Cloudinary** (plan gratuito, *upload preset* sin firmar) |
| Mapas y ubicación | `react-native-maps` y `expo-location` |
| Rutas, distancia y duración | **OSRM** (API gratuita de OpenStreetMap), en lugar de Google Directions y Distance Matrix |
| Pagos | **Mercado Pago Checkout Pro** (API de Preferences) en modo de prueba |
| Backend de pagos | **Node.js + Express** |
| Almacenamiento local | AsyncStorage, solo para la sesión y las preferencias (idioma y último estado de disponibilidad) |
| Formularios | `expo-image-picker`, `@react-native-community/datetimepicker`, `@react-native-picker/picker` |

## Requisitos previos

- [Node.js](https://nodejs.org/) **18 o superior** (el backend usa `fetch` nativo).
- Git.
- La app **Expo Go** en el celular, compatible con SDK 58.
- Un proyecto de **Firebase** con Cloud Firestore.
- Una cuenta gratuita de **Cloudinary**.
- Una cuenta de **Mercado Pago Developers** con cuentas de prueba (vendedor y comprador).
- El **celular y el computador en la misma red** (Wi-Fi o hotspot del celular).

## Instalación

### 1. Clonar e instalar

```bash
git clone https://github.com/XavierRua/UberCloneConductor.git
cd UberCloneConductor
npm install
cd backend
npm install
cd ..
```

### 2. Variables de entorno

Hay **dos** archivos `.env`, uno para la app y otro para el backend. Ninguno se sube a GitHub (están en el `.gitignore`); cada uno tiene su plantilla **`.env.example`** con los nombres de las variables, sin valores.

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
```

En macOS o Linux: `cp .env.example .env` y `cp backend/.env.example backend/.env`.

Formato: una variable por línea, **sin comillas, sin espacios** alrededor del `=` y **sin punto y coma**.

**App (`.env` en la raíz)**

| Variable | Valor |
|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | `apiKey` de la app Web de Firebase |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | `appId` |
| `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` | *Cloud name* del panel de Cloudinary |
| `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Nombre del *upload preset* en modo **Unsigned** |
| `EXPO_PUBLIC_BACKEND_URL` | `http://IP_DEL_COMPUTADOR:3000` |

**Backend (`backend/.env`)**

| Variable | Valor |
|---|---|
| `PORT` | `3000` |
| `PUBLIC_BASE_URL` | `http://IP_DEL_COMPUTADOR:3000` |
| `MP_ACCESS_TOKEN` | Access Token de **producción** de la **cuenta de prueba de vendedor** (`APP_USR-...`) |
| `MP_USE_SANDBOX` | `false` |
| `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID` | Los mismos valores de Firebase de la app |

La IP del computador se ve con `ipconfig` (Windows), en la línea **Dirección IPv4** del adaptador Wi-Fi, o en la línea `Metro: exp://...` al iniciar Expo. **Cambia si se cambia de red**: en ese caso hay que actualizarla en los dos `.env`.

> **Seguridad:** el `MP_ACCESS_TOKEN` es una llave secreta y **solo** va en `backend/.env`, nunca en la app. Durante todo el proyecto se usan **solo credenciales de prueba**.

### 3. Configurar Firebase

1. Crear un proyecto en la [consola de Firebase](https://console.firebase.google.com/) (plan Spark).
2. Crear la base de datos **Firestore**.
3. Registrar una **app Web** (`</>`) y copiar los valores de `firebaseConfig` al `.env`.
4. Crear el **índice compuesto** que usa el historial: Firestore → Índices → Compuestos → Estructurado → colección `trips`, campos `driverId` (ascendente), `status` (ascendente) y `completedAt` (descendente).

### 4. Configurar Cloudinary

1. Crear una cuenta gratuita en [cloudinary.com](https://cloudinary.com/) y anotar el **Cloud name**.
2. En **Settings → Upload → Upload presets**, crear un preset en modo **Unsigned** con una carpeta propia (por ejemplo `uber-clone-conductor`).

### 5. Configurar Mercado Pago (modo de prueba)

1. En [Mercado Pago Developers](https://www.mercadopago.com.co/developers), crear una aplicación con **Checkout Pro** y **API de Preferences**.
2. En **Cuentas de prueba**, crear una cuenta de **Vendedor** y una de **Comprador** de Colombia.
3. En una ventana de incógnito, iniciar sesión con la **cuenta de prueba de vendedor**, crear allí una aplicación igual y copiar su **Access Token de producción** (`APP_USR-...`) a `backend/.env`.
4. Para pagar, en el checkout se inicia sesión con la **cuenta de prueba de comprador** y se usa una tarjeta de prueba (página *Tarjetas de prueba* del panel). El **nombre del titular** define el resultado: `APRO` (aprobado), `OTHE` (rechazado) o `CONT` (pendiente).

## Ejecución

Se necesitan **dos terminales**:

**Terminal 1: backend de pagos**

```bash
cd backend
node index.js
```

Debe mostrar el proyecto de Firebase, la dirección pública, `Access token de Mercado Pago cargado: sí` y `Backend de pagos escuchando en el puerto 3000`. Para comprobar la conexión desde el celular: abrir `http://IP_DEL_COMPUTADOR:3000/health` en su navegador; debe responder `{"ok":true}`.

**Terminal 2: app**

```bash
npx expo start --clear
```

Escanear el código QR con Expo Go. Si la app se queda cargando, borrar la caché de Expo Go (*Información de la aplicación → Almacenamiento → Borrar caché*) y volver a escanear.

### Probar el flujo completo

1. Registrar un conductor con datos ficticios.
2. En Firestore, cambiar `approvalStatus` del conductor de `pending` a `approved`: el celular se actualiza solo.
3. Ponerse **Disponible** y tocar **Simular solicitud**.
4. Aceptar → Ir a recoger → Pasajero a bordo → Finalizar viaje.
5. Cobrar en efectivo o con Mercado Pago (si el panel no cambia solo después de pagar, tocar **Ya pagó: verificar pago**).
6. Revisar **Historial** y **Ganancias**.

## Flujo de pago con Mercado Pago

1. Al finalizar el viaje, la app calcula la tarifa final con `calculateFare`.
2. La app envía al backend el `tripId` (`POST /payments/preference`).
3. El backend lee la tarifa **desde Firestore** (no desde la app) y crea la preferencia con el access token; responde `201` con el enlace del checkout.
4. La app abre el checkout y el pasajero paga con la cuenta y la tarjeta de prueba.
5. El backend obtiene el resultado consultando a Mercado Pago, por la URL de retorno (`GET /payments/return`) o por la verificación que pide la app (`POST /payments/verify`, que busca el pago por `external_reference`), y actualiza el viaje: `paymentStatus`, `paymentId` y `status: paid`.
6. La app, que escucha el viaje en tiempo real, muestra el resumen del cobro.

En efectivo, el conductor marca el cobro como recibido; como la plataforma no recibió el dinero, la comisión se descuenta de su **saldo**.

## Tarifa y comisión

Los parámetros están en un único archivo, `src/config/pricing.js`, y los valores se manejan en **pesos colombianos enteros**:

```
Tarifa     = max(Mínima, (Base + km · Vkm + min · Vmin) · Mcategoría), redondeada a la centena
Comisión   = Tarifa · 0,20
Ganancia   = Tarifa − Comisión + Propina
```

Ejemplo del enunciado (8,5 km y 22 minutos, sin propina): **Económico** → tarifa 19.200, comisión 3.840, ganancia 15.360. **XL** → tarifa 26.900, comisión 5.380, ganancia 21.520. Cada viaje guarda el `commissionRate` aplicado, para que un cambio futuro de porcentaje no altere el historial.

## Modelo de datos (Firestore)

**`drivers/{celular}`**: un documento por conductor; el ID es el número de celular.

```
fullName, documentId, phone, birthDate, gender, email, language
vehicle:   { category, plate, brand, model, year, color, capacity }
documents: { licenseNumber, licenseExpiry, soatExpiry, technicalReviewExpiry,
             mercadoPagoEmail, termsAccepted, commissionRate }
photos:    { profile, vehicle, license, soat, technicalReview? } → { url, publicId } en Cloudinary
approvalStatus: 'pending' | 'approved'
isAvailable, location { lat, lng }, createdAt
```

**`trips/{id}`**: un documento por viaje.

```
driverId, passengerId, origin { lat, lng, address }, destination { lat, lng, address }
distanceKm, durationMin, category, paymentMethod ('cash' | 'mercadopago')
estimatedFare, estimatedEarnings, fare, commission, tip, driverEarnings, commissionRate
status, paymentStatus ('pending' | 'approved' | 'rejected' | 'cash'), paymentId
route [{ latitude, longitude }], rating, createdAt, acceptedAt, completedAt, paidAt
```

## Hooks y requisitos del enunciado

| Requisito | Dónde |
|---|---|
| `useState` (disponibilidad, solicitud activa, formularios) | Pantallas y contextos |
| `useEffect` con limpieza (ubicación, temporizador, suscripciones) | `useDriverLocation`, `TripRequestCard`, `useTripRequests`, contextos |
| `useContext` (sesión y viaje activo) | `SessionContext`, `ActiveTripContext` (además `RegisterContext` y `LanguageContext`) |
| `useMemo` (totales de ganancias) | `useEarnings` |
| `useCallback` (aceptar y rechazar) | `HomeScreen` |
| Hooks personalizados | `useDriverLocation`, `useTripRequests`, `useEarnings` (además `usePersistentState`, `useKeyboardPadding` y otros) |

## Estructura de carpetas

```
backend/        Backend de pagos (Node.js + Express): index.js, .env.example
docs/
  AI_LOG.md     Bitácora de uso de inteligencia artificial
src/
  components/   Componentes reutilizables (campos de formulario, tarjetas de solicitud y viaje, filtros)
  config/       firebaseConfig.js y pricing.js
  constants/    Opciones del registro, llaves de AsyncStorage y textos en español e inglés
  context/      Contextos: registro, sesión, viaje activo e idioma
  hooks/        Hooks personalizados
  navigation/   RootNavigator (Stack), RegisterTabs (Tabs) y DriverDrawer (Drawer)
  screens/      Pantallas
  services/     Firestore (conductores y viajes), Cloudinary, OSRM, backend de pagos y AsyncStorage
  theme/        Colores, espaciados, tipografía y sombras
  utils/        calculateFare, validaciones, fechas y formatos
```

## Limitaciones y mejoras futuras

- **Solicitudes de viaje**: el backend de la profesora que simula al pasajero aún no está disponible. Mientras tanto, el botón **Simular solicitud** crea viajes de prueba en la colección `trips`, que la app escucha en tiempo real; al recibir ese backend solo habrá que conectarlo a la misma colección.
- **Notificaciones (FCM)**: no se implementaron, porque requieren un *development build* en lugar de Expo Go.
- **Imágenes al eliminar el usuario**: se borran todos los datos de Firestore, incluidas las URL, pero las imágenes de Cloudinary solo pueden borrarse con la llave secreta de Cloudinary desde un backend.
- **Mercado Pago**: se usa la **API de Preferences** (flujo clásico de Checkout Pro). Mercado Pago recomienda la **API de Orders** para integraciones nuevas; la migración queda como mejora.
- **Inicio de sesión**: se hace solo con el número de celular. Una versión de producción debería verificar con un código SMS (Firebase Authentication).
- **Reglas de Firestore**: ver la sección siguiente.

## Reglas de seguridad de Firestore

<!-- Completar cuando se publiquen las reglas definitivas -->

## Flujo de trabajo con Git

- La rama `main` contiene la versión estable.
- El desarrollo se hace en la rama del integrante (`xavierRua`).
- Cada avance se sube a `main` mediante un **Pull Request** revisado.

## Uso de IA

En este proyecto se usó **Claude** (Anthropic) como asistente de desarrollo. Todo su uso está documentado en la bitácora, siguiendo el instructivo de la asignatura: prompt completo, resumen de la respuesta, qué se usó, modificó o descartó, archivos y commit afectados, y cómo se verificó.

- Bitácora: [docs/AI_LOG.md](docs/AI_LOG.md)
- Los bloques de código asistidos por IA están marcados con un comentario en inglés que remite a la entrada correspondiente, por ejemplo: `// AI-assisted: see docs/AI_LOG.md #22`.

## Video

<!-- Pegar aquí el enlace al video de demostración (máximo 5 minutos) -->

## Autor

**Xavier Rua** — Desarrollo Móvil.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE).