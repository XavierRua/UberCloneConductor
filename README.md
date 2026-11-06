# UberClone — Versión Conductor

Aplicación móvil multiplataforma inspirada en Uber, en su versión para el **conductor**, construida con **React Native y Expo** para Android e iOS. Proyecto de la asignatura **Desarrollo Móvil**.

El conductor se registra con sus datos personales, los de su vehículo y sus documentos; la cuenta queda **pendiente de aprobación**, y desde su perfil puede cerrar sesión o eliminar su usuario por completo.

## Estado del proyecto

### Primera entrega

| Funcionalidad | Estado |
|---|---|
| Registro en tres pestañas (Datos personales, Vehículo, Documentos) | ✔ |
| Validaciones de todos los campos, con el error debajo de cada uno | ✔ |
| Botón **Enviar registro** habilitado solo con las tres pestañas válidas | ✔ |
| Guardado del conductor en Firestore con estado *Pendiente de aprobación* | ✔ |
| Un solo conductor por número de celular | ✔ |
| Sesión del conductor guardada en el dispositivo | ✔ |
| Perfil con **Cerrar sesión** y **Eliminar usuario** (sin dejar datos en Firestore) | ✔ |
| Subida de fotos a Firebase Storage | Pendiente |

### Segunda entrega (planeada)

Mapa con estado Disponible / No disponible, solicitudes de viaje en tiempo real, navegación al punto de recogida y al destino, cobro con Mercado Pago en modo de prueba, cálculo de tarifa y comisión, ganancias e historial de carreras.

## Tecnologías

- **Expo SDK 58** con React Native y React.
- **React Navigation**: Stack y Bottom Tabs.
- **Firebase**: Cloud Firestore para los datos del conductor.
- **AsyncStorage**: solo para la sesión y las preferencias (nunca datos sensibles).
- **expo-image-picker**, **@react-native-community/datetimepicker** y **@react-native-picker/picker** para los formularios.

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión LTS).
- Git.
- La app **Expo Go** en el celular (compatible con SDK 58).
- Un proyecto propio de **Firebase** con Cloud Firestore.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/XavierRua/UberCloneConductor.git
   cd UberCloneConductor
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear el archivo de variables de entorno a partir de la plantilla:

   ```powershell
   Copy-Item .env.example .env
   ```

   En macOS o Linux: `cp .env.example .env`.

4. Completar el `.env` con los datos de tu proyecto de Firebase (ver la sección siguiente).

5. Iniciar el proyecto limpiando la caché, para que Expo lea el `.env`:

   ```bash
   npx expo start --clear
   ```

6. Escanear el código QR con Expo Go. El celular y el computador deben estar en la misma red; si no conecta, usar `npx expo start --tunnel`.

## Variables de entorno

La configuración de Firebase **no está en el código**: se lee desde un archivo `.env` que está excluido de Git en el `.gitignore`. El repositorio incluye **`.env.example`** con los nombres de las variables, sin valores:

| Variable | Valor en la configuración web de Firebase |
|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | `appId` |

Formato del `.env`: una variable por línea, **sin comillas, sin espacios** alrededor del `=` y **sin punto y coma**. Expo solo expone las variables que empiezan con `EXPO_PUBLIC_`. Si se cambia el `.env`, hay que reiniciar con `npx expo start --clear`.

### Configurar Firebase

1. Crear un proyecto en la [consola de Firebase](https://console.firebase.google.com/) (plan Spark, sin Google Analytics).
2. Crear la base de datos **Firestore** en modo de prueba.
3. Registrar una **app Web** (`</>`) y copiar los valores de `firebaseConfig` al `.env`.

## Modelo de datos

Colección **`drivers`** en Firestore, con **un documento por conductor cuyo ID es el número de celular**. Así se garantiza que no haya dos conductores con el mismo celular.

```
drivers/{celular}
  fullName, documentId, phone, birthDate, gender, email, language
  vehicle: { category, plate, brand, model, year, color, capacity }
  documents: { licenseNumber, licenseExpiry, soatExpiry, technicalReviewExpiry,
               mercadoPagoEmail, termsAccepted, commissionRate }
  photos            → pendiente (URL de Firebase Storage)
  approvalStatus    → 'pending' | 'approved'
  createdAt
```

Para simular la aprobación de un conductor, se cambia `approvalStatus` a `approved` desde la consola de Firestore.

## Estructura de carpetas

```
src/
  components/   Componentes reutilizables de formulario (campo, lista, fecha, foto, casilla, botón)
  config/       Configuración de Firebase (firebaseConfig.js) y de tarifas (pricing.js)
  constants/    Opciones de las listas del registro y llaves de AsyncStorage
  context/      Contextos del registro y de la sesión
  hooks/        Hooks de acceso a los contextos y de persistencia local
  navigation/   Navegación principal (Stack) y pestañas del registro (Tabs)
  screens/      Pantallas del registro y del perfil
  services/     Acceso a Firestore (driverService.js) y a AsyncStorage
  theme/        Colores, espaciados, tipografía y sombras
  utils/        Validaciones del registro
docs/
  AI_LOG.md     Bitácora de uso de inteligencia artificial
```

## Flujo de trabajo con Git

- La rama `main` contiene la versión estable.
- El desarrollo se hace en la rama del integrante (`xavierRua`).
- Cada avance se sube a `main` mediante un **Pull Request** revisado.

## Uso de IA

En este proyecto se usó **Claude** (Anthropic) como asistente de desarrollo. Todo su uso está documentado en la bitácora, siguiendo el instructivo de la asignatura: prompt completo, resumen de la respuesta, qué se usó, modificó o descartó, archivos y commit afectados, y cómo se verificó.

- Bitácora: [docs/AI_LOG.md](docs/AI_LOG.md)
- Los bloques de código asistidos por IA están marcados con un comentario en inglés que remite a la entrada correspondiente, por ejemplo: `// AI-assisted: see docs/AI_LOG.md #22`.

## Autor

**Xavier Rua** — Desarrollo Móvil.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE).