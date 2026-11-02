Entrada #1
Fecha: 2026-10-21
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Crear el archivo de la bitácora de IA (docs/AI_LOG.md) siguiendo el instructivo del curso.
Prompt: realiza una bitácora de consultas según las especificaiones del taller

Resumen de la respuesta: Claude explicó que expo-doctor revisa el proyecto y detecta versiones incompatibles con el SDK, dependencias duplicadas o faltantes y errores de configuración. Indicó los comandos npx expo install --check y --fix para corregir versiones, y cuándo conviene ejecutarlo. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]

Qué se usó / modificó / descartó: Consulta conceptual; se ejecutó npx expo-doctor en el proyecto. No se generó código.

Archivos y commit: Ninguno (consulta conceptual).

Verificación: Ejecución de npx expo-doctor en el proyecto, que mostró 19/20 chequeos aprobados (ver entrada #4).
Aprendizaje: se crea el archivo Ai_Log.md para registrar las entradas de consulta a la AI

-------------------------------------------------------------------------------------------

Entrada #2
Fecha: 2026-10-21
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Entender la función de cada paquete instalado para navegación, almacenamiento local e íconos.
Prompt:

para que sirve la siguiente librería: npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage @expo/vector-icons

Resumen de la respuesta: Claude explicó que el comando instala siete paquetes y que npx expo install elige versiones compatibles con el SDK. Describió cada uno: React Navigation (núcleo, stack y pestañas inferiores) con sus dependencias react-native-screens y safe-area-context, AsyncStorage para persistencia local y @expo/vector-icons para íconos. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó: Consulta conceptual; se usó como referencia para entender las dependencias del proyecto. No se generó código.
Archivos y commit: Ninguno (consulta conceptual).
Verificación: [p. ej. contraste con la documentación oficial de React Navigation y Expo]
Aprendizaje: librerias necesarias para la creacion del proyecto

--------------------------------------------------------------------------------------------

Entrada #3
Fecha: 2026-10-21
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Entender para qué sirve la herramienta de diagnóstico expo-doctor.
Prompt:

para que sirve npx expo-doctor

Resumen de la respuesta: Claude explicó que expo-doctor revisa el proyecto y detecta versiones incompatibles con el SDK, dependencias duplicadas o faltantes y errores de configuración. Indicó los comandos npx expo install --check y --fix para corregir versiones, y cuándo conviene ejecutarlo. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó: Consulta conceptual; se ejecutó npx expo-doctor en el proyecto. No se generó código.
Archivos y commit: Ninguno (consulta conceptual).
Verificación: Ejecución de npx expo-doctor en el proyecto, que mostró 19/20 chequeos aprobados (ver entrada #4).
Aprendizaje: este comando me permite revisar que las carpetas iniciales no tengan errores, en la comprobacion sale un errror que indica el faltante de ecpo-font 

--------------------------------------------------------------------------------------------

Entrada #4
Fecha: 2026-10-21
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Corregir el chequeo fallido de expo-doctor por la dependencia faltante expo-font.
Prompt: luego de ejecutar npx expo-doctor me sale un error: 19/20 checks passed. 1 checks failed. Possible issues detected: Use the --verbose flag to see more details about passed checks.

✖ Check that required peer dependencies are installed Missing peer dependency: expo-font Required by: @expo/vector-icons Advice: Install missing required peer dependency with "npx expo install expo-font" Your app may crash outside of Expo Go without this dependency. Native module peer dependencies mustbe installed directly.

1 check failed, indicating possible issues with the project.

Resumen de la respuesta: Claude explicó que @expo/vector-icons usa fuentes tipográficas y necesita expo-font como peer dependency, que debe instalarse directamente en el proyecto. Indicó instalarla con npx expo install expo-font y volver a ejecutar npx expo-doctor. Enlace a la conversación: [pegar enlace]
Qué se usó / modificó / descartó: se ejecuta el comando npx expo install expo-font
Usado tal cual: comando npx expo install expo-font.
Modificado / descartado: se agrega auntomticamente el archivo faltante
Archivos y commit: `docs/AI_LOG.md` — [854d5b1d4ef459a9aa475909674a6c53083c262a]
Verificación: confirmar: npx expo-doctor muestra 20/20 checks passed
Aprendizaje: antes de contunuar con la realizacion del proyecto es importante ejecutar el comando npx expo-doctor ya que en ocaciones los archivos no se descargan todos.

--------------------------------------------------------------------------------------------

Entrada #5
Fecha: 2026-10-21
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Cambiar el proyecto de Expo SDK 58 a SDK 57 para poder abrirlo en Expo Go en Android.
Prompt: al crear el proyecto me descargo la versión
Resumen de la respuesta: Claude propuso dos opciones: bajar la versión en el mismo proyecto con npx expo install expo@^57.0.0 seguido de npx expo install --fix, o crear el proyecto de nuevo con la plantilla blank@sdk-57. Incluyó una instalación limpia (borrar node_modules y package-lock.json, limpiar caché) por si aparecían errores. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [indicar la opción aplicada: 1 (bajar versión) o 2 (crear de nuevo)].
Descartado: [la opción no utilizada].
Archivos y commit: `docs/AI_LOG.md` — [854d5b1d4ef459a9aa475909674a6c53083c262a]
Verificación: [confirmar: package.json con "expo": "~57.0.x" y app abierta en Expo Go]
Aprendizaje: se instalo automaticamente la version 58 y en mi celular tengo la version 57, se realiza el cambio a la version 57.

--------------------------------------------------------------------------------------------

Entrada #6
Fecha: 2026-10-21
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Aprender a proteger las llaves secretas de las pasarelas de pago (Mercado Pago y Stripe).
Prompt: como proteger las llaves secretas. El access_token de Mercado Pago o la secret key de Stripe
Resumen de la respuesta: Claude explicó que las llaves secretas nunca deben estar en la app móvil, porque el APK se puede descompilar y las variables EXPO_PUBLIC_ quedan expuestas. La app solo usa la llave pública y un backend (por ejemplo, funciones serverless) guarda la secreta y crea los pagos. Recomendó .env en .gitignore, credenciales de prueba y revocar cualquier llave filtrada. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó: Consulta conceptual; los fragmentos de código de ejemplo no se incorporaron al proyecto. El prompt no incluyó llaves reales.
Archivos y commit: Ninguno (consulta conceptual).
Verificación: [p. ej. contraste con la documentación oficial de Stripe y Mercado Pago sobre Archivos y commit: `docs/AI_LOG.md` — [854d5b1d4ef459a9aa475909674a6c53083c262a]
Aprendizaje: se comprende la importacion de las llaves.

--------------------------------------------------------------------------------------------

Entrada #7
Fecha: 2026-10-21
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Actualizar el proyecto de Expo SDK 57 a SDK 58, porque Expo Go del celular pasó a SDK 58.
Prompt:

actualizar expo 57 a 58

Resumen de la respuesta: Claude indicó trabajar en una rama aparte, ejecutar npx expo install expo@^58.0.0 y npx expo install --fix para alinear todas las librerías, verificar con npx expo-doctor y hacer una instalación limpia si aparecían errores. Terminó con el commit y el Pull Request hacia main. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: comandos de actualización y verificación.
Modificado / descartado: [completar, o "Nada"].
Archivos y commit: package.json, package-lock.json — [hash]
Verificación: El proyecto quedó en SDK 58 y abre correctamente en Expo Go en el celular. Archivos y commit: `docs/AI_LOG.md` — [854d5b1d4ef459a9aa475909674a6c53083c262a]
Aprendizaje: se realiza el cambio de la version del expo 58

--------------------------------------------------------------------------------------------

Entrada #8
Fecha: 2026-10-29
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Entender cómo funciona AsyncStorage y cómo aplicarlo en la app del conductor.
Prompt:

explicame todo lo relacionado con el AsyncStorage

Resumen de la respuesta: Claude explicó que AsyncStorage es un almacenamiento clave-valor persistente, asíncrono, solo de texto y sin cifrado. Mostró sus funciones (setItem, getItem, removeItem, mergeItem, multiGet, clear), el uso de JSON.stringify/JSON.parse, un servicio centralizado storage.js y un ejemplo del interruptor de disponibilidad. Indicó qué no guardar ahí (tokens → expo-secure-store, datos grandes → expo-sqlite). Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó: Consulta conceptual; el código de ejemplo aún no se ha incorporado al proyecto. Si se usa el servicio storage.js, se registrará en una nueva entrada.
Archivos y commit: `docs/AI_LOG.md` — [854d5b1d4ef459a9aa475909674a6c53083c262a]
Verificación: [p. ej. contraste con la documentación oficial de AsyncStorage]

--------------------------------------------------------------------------------------------

Entrada #9
Fecha: 2026-10-29
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Actualizar la bitácora con todas las consultas realizadas hasta el momento.
Prompt:

dame la bitacora de consultas que llevamos hasta el momento

Resumen de la respuesta: Claude generó la versión actualizada de docs/AI_LOG.md con las entradas #1 a #9, cada una con su prompt textual, resumen, archivos afectados y campos pendientes por completar. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: estructura y contenido de las entradas.
Modificado: fechas, hashes y campos de aprendizaje completados por el integrante.
Archivos y commit: `docs/AI_LOG.md` — [854d5b1d4ef459a9aa475909674a6c53083c262a]
Verificación: Revisión de que cada prompt coincide con el historial de la conversación y de que el archivo se visualiza bien en GitHub.

--------------------------------------------------------------------------------------------

Entrada #10
Fecha: 2026-10-29
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Encontrar el error del hook personalizado `usePersistentState`, que sincroniza un estado de React con AsyncStorage.
Prompt:cual es el error de este codigo :
Resumen de la respuesta: Claude identificó que el error principal es que `useEffect` se usa sin importarlo desde `react`. Señaló además tres mejoras: agregar `.catch()` a la carga, reiniciar `ready` cuando cambia la clave y permitir que `update` reciba funciones (`prev => ...`) como `setState`. Entregó una versión corregida que usa `useRef`.
  Enlace a la conversación: [pegar enlace]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: solo la corrección del import, o la versión corregida completa].
Archivos y commit: `docs/AI_LOG.md` — [854d5b1d4ef459a9aa475909674a6c53083c262a]
Aprendizaje: se debe realizar siempre la importacion de useEFfect


--------------------------------------------------------------------------------------------

Entrada #11

Fecha: 2026-10-29
Integrante:Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Crear el proyecto en la consola de Firebase y conectarlo a la app de Expo.
Prompt: como crear un proyecto en la consola de Firebase.
Resumen de la respuesta: Claude explicó cómo crear el proyecto en la consola, registrar la app como **Web** (porque Expo Go usa el SDK de JavaScript y no `@react-native-firebase`) y activar Authentication (correo/contraseña) y Firestore. Advirtió que Storage requiere el plan Blaze. Entregó el archivo de configuración con persistencia de sesión mediante AsyncStorage y variables `EXPO_PUBLIC_` en `.env`. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual:[completar: pasos de la consola, código de configuración
Modificado: el archivo se nombró `firebaseConfig.js` en lugar de `firebase.js`. [agregar otros cambios]
Archivos y commit: `src/services/firebaseConfig.js`, `package.json`, `package-lock.json` — [d8ed866a65f64a3e398ac1a268abac52da00b94e]
Verificación:[p. ej. la app abre en Expo Go sin errores de Firebase; proyecto visible en la consola con Authentication y Firestore activos]
Aprendizaje: creacion de proyecto en Firestore.

--------------------------------------------------------------------------------------------

Entrada #12

Fecha:** 2026-10-29,
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Entender para qué sirven los archivos `.env` y `.env.example`.
Prompt: que es .env y .env.example
Resumen de la respuesta: Claude explicó que `.env` guarda los valores reales de las variables de entorno y no se sube a GitHub (va en `.gitignore`), mientras que `.env.example` es la plantilla con los mismos nombres sin valores y sí se sube. Indicó que Expo solo expone las variables con prefijo `EXPO_PUBLIC_`, que se debe reiniciar con `npx expo start -c` y cómo sacar un `.env` subido por error con `git rm --cached`.
Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:[completar: p. ej. se crearon `.env` y `.env.example` y se agregó `.env` al `.gitignore`]
Archivos y commit: `.env.example`, `.gitignore` — [d8ed866a65f64a3e398ac1a268abac52da00b94e] (el `.env` no se sube al repositorio)
Aprendizaje: subir las llaves de fireBase podria ocacionar que una persona acceda a mi base de datos.

--------------------------------------------------------------------------------------------

Entrada #13

Fecha:** 2026-10-29, 
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Entender la función del archivo `firebaseConfig.js` dentro de la app.
Prompt:para que sirve `firebaseConfig.js`.

Resumen de la respuesta: Claude explicó que `firebaseConfig.js` reúne la configuración del proyecto, inicializa Firebase una sola vez y exporta los servicios (`auth`, `db`) para que las pantallas y servicios los importen. Señaló que centralizarlo evita el error de inicialización duplicada y separa la configuración de la interfaz.
  Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó: Consulta conceptual; los ejemplos de `LoginScreen` y `tripService` no se incorporaron al proyecto.
Archivos y commit: Ninguno [d8ed866a65f64a3e398ac1a268abac52da00b94e].
Verificación:[p. ej. contraste con la documentación oficial de Firebase para la Web]
Aprendizaje: Este archivo es el puente entre tu app y la base de datos en Firebase

--------------------------------------------------------------------------------------------


Entrada #14
Fecha: 2026-10-29,
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Conectar la app de Expo a la base de datos Firestore.
Prompt:como puedo conectar expo a la base de datos

Resumen de la respuesta: Claude indicó verificar que Firestore esté creado y revisar sus reglas de seguridad, confirmar que firebaseConfig.js exporte db y crear un servicio driverService.js con funciones para crear, leer, actualizar y escuchar en tiempo real el perfil del conductor. Incluyó una prueba de conexión, una tabla de funciones de Firestore y los errores comunes (permission-denied, .env no cargado, conexión que no responde). Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. la idea de la prueba de conexión].
Modificado: la prueba se escribió con setDoc y un id fijo (ping) en lugar de addDoc (ver entrada #16).
Descartado: [completar: p. ej. driverService.js aún no se incorpora].
Archivos y commit: [d8ed866a65f64a3e398ac1a268abac52da00b94e]
Verificación: [p. ej. documento ping visible en la colección connectionTest de la consola]
Aprendizaje: se realiza la configuracion y creacion de la bd.

--------------------------------------------------------------------------------------------

Entrada #15
Fecha: 2026-10-29,
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Revisar el código de prueba de conexión con Firestore en App.js.
Prompt:revisa este codigo :

Resumen de la respuesta: Claude confirmó que el código es correcto y que usar setDoc con un id fijo evita acumular documentos. Señaló que, sin conexión, Firestore deja la escritura pendiente y el mensaje se queda en "Probando..." indefinidamente, por lo que propuso un límite de 10 segundos con Promise.race y mostrar error.code. Incluyó una tabla para interpretar cada mensaje. Enlace a la conversación: [pegar enlace]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: versión con límite de tiempo, o se conservó el código original].
Modificado : se modificó el archivo original a la App.js con un nuevo condigo para podrer revisar la conexion entre la app y la bd
Archivos y commit: App.js — [d8ed866a65f64a3e398ac1a268abac52da00b94e]
Verificación: [p. ej. la app muestra "Conexión exitosa con Firestore" en Expo Go y el documento ping aparece en la consola]
Aprendizaje: se logra conectar el celular a la base de datos con ayuda de la Ai 

--------------------------------------------------------------------------------------------


Entrada #16
Fecha: 30 -10-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Construir las opciones de las listas desplegables del formulario de registro del conductor y un componente para mostrarlas.
Prompt: como puedo construir un aOpciones de las listas desplegables de registro en js

Resumen de la respuesta: Claude explicó que React Native no tiene un <select> y propuso un archivo de constantes con arreglos de opciones { label, value } (tipo de documento, tipo de vehículo, marcas por tipo, colores, ciudades y años generados con una función), más un componente propio SelectField con Modal y FlatList, sin instalar dependencias. Mostró su uso en la pantalla de registro, incluida una lista dependiente (marca según tipo de vehículo) y la función getOptionLabel. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145S]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. estructura { label, value }, componente SelectField].
Modificado: las listas se adaptaron al enunciado (categorías de vehículo, género, colores e idioma). [completar otros cambios]
Descartado: tipo de documento, marcas, ciudades y años del modelo; la librería @react-native-picker/picker. [ajustar según lo que realmente se usó]
Archivos y commit: f32b1b2402f29787a69031b37e62f868fb26e0ca


--------------------------------------------------------------------------------------------
Entrada #17
Fecha: 30 -10-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Revisar el archivo de opciones de las listas desplegables construido para el registro.
Prompt: lo construi de la sigueinte forma :


// Capacidad mínima de pasajeros para la categoría XL (enunciado, pestaña Vehículo)
export const MIN_XL_CAPACITY = 6;

// Años de antigüedad desde los que se exige la revisión técnico-mecánica (vehículo particular en Colombia)
export const TECHNICAL_REVIEW_FREE_YEARS = 5;

// Solo los valores, para validar que lo elegido exista en la lista
export const getValues = (options) => options.map((option) => option.value);
Resumen de la respuesta: Claude confirmó que la estructura { value, label } es correcta y compatible con SelectField, y destacó las constantes con comentario de origen. Sugirió calcular la revisión técnico-mecánica con la fecha de matrícula, mostrar un campo de texto cuando el color sea "Otro", agregar la función getOptionLabel y un ejemplo de validación con getValues. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145S]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. función getOptionLabel, campo de texto para color "Otro"].
Modificado / descartado: [completar, o "Nada"].
Archivos y commit: f32b1b2402f29787a69031b37e62f868fb26e0ca

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Entrada #18
Fecha: 1-NOV-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Ajustar las validaciones por campo del registro del conductor a las reglas exactas del enunciado.
Prompt: como realizarValidaciones por campo: nombre completo (máximo 50, solo letras con tildes/ñ y espacios), documento (numérico, 6 a 10 dígitos), celular (numérico, 10 dígitos), fecha de nacimiento (mayor de 18 años), correo (con @ y dominio), placa colombiana ABC123 (convertir a mayúsculas antes de validar), marca y modelo (máximo 30), año (4 dígitos, no mayor al actual), capacidad (numérica; XL mínimo 6), fechas de vencimiento posteriores a hoy, número de licencia numérico, y revisión técnico-mecánica obligatoria solo si el vehículo tiene 5 años o más

Resumen de la respuesta: Claude comparó cada regla del enunciado con el archivo de validaciones existente y confirmó que todas estaban cubiertas. Entregó la versión final con tres ajustes: la función toText para evitar el error value.trim is not a function, la fecha de vencimiento que rechaza el mismo día de hoy ("posterior a hoy") y la validación de fechas inválidas. Retiró la sugerencia previa de aceptar el año siguiente, porque el enunciado exige "no mayor al actual". Enlace a la conversación: [(https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145)]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. archivo completo validacionesRegistro.js].
Modificado: [completar, o "Nada"].
Descartado: la sugerencia de la entrada #22 de aceptar el año siguiente en validateYear.
Archivos y commit: src/utils/validacionesRegistro.js — [3ae1b5fa0c3faa3053d830a955ead2596e3111be]
Verificación: Las funciones se ejecutaron con casos límite de cada regla: nombre de 51 caracteres, documento de 5 dígitos, celular de 9 dígitos, 17 y 18 años de edad, correo sin dominio, placa abc123 (válida) y AB1234 (rechazada), año actual + 1, capacidad 5 y 6 en XL, vencimiento hoy (rechazado) y mañana (válido), licencia con letras, y vehículo de 4 y 5 años. Todas dieron el resultado esperado. [Agregar la prueba en Expo Go]
Aprendizaje: Este archivo fue consultado en internet y con la ayuda de la ia se genero.

--------------------------------------------------------------------------------------------
Entrada #19
Fecha: [01-11-2026],
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Revisar el estado inicial de los datos personales del formulario de registro del conductor.
Prompt:revisa este formulario

const initialPersonalData = { profilePhoto: '', fullName: '', // ... birthDate: null, language: 'es', };

Resumen de la respuesta: Claude confirmó que los valores iniciales son correctos (textos vacíos, birthDate en null y language con valor por defecto válido) y advirtió que el // ... en una sola línea comenta el resto del objeto y lo deja sin cerrar. Recomendó escribir el objeto en varias líneas, usar las mismas claves que validatePersonalData y propuso los estados iniciales de las pestañas Vehículo y Documentos. Pidió el formulario completo para revisarlo. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. objetos initialPersonalData, initialVehicleData, initialDocumentsData].
Modificado / descartado: [completar, o "Nada"].
Archivos y commit: src/screens/[pantalla de registro].js — [564840404a16e295323cbf7b480c85301ad3037d]
Verificación: [p. ej. el formulario abre sin errores y al presionar "Siguiente" con campos vacíos muestra los mensajes de cada campo]
Aprendizaje: se replica este misma estructura en initialVehicle, initialDocuments

--------------------------------------------------------------------------------------------

Entrada #22
Fecha: 01-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Encontrar la causa del error en el archivo de validaciones del registro.
Prompt: revisa este codigo que me sale un error :

Se adjuntó como documento el archivo de validaciones completo
Resumen de la respuesta: Como no se incluyó el mensaje del error, Claude revisó el código y señaló dos causas probables: TypeError: value.trim is not a function cuando un campo llega como número (propuso la función auxiliar toText) y una ruta incorrecta del import ../constants/opcionesRegistro. Indicó además que las fechas deben ser objetos Date, que validateYear no acepta el año siguiente y renombrar la variable document. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. función toText en lugar de value.trim()].
Modificado / descartado: [completar: p. ej. aceptar el año siguiente en validateYear, renombrar document].
Archivos y commit: src/utils/[archivo de validaciones].js — [564840404a16e295323cbf7b480c85301ad3037d]
Verificación: [completar: mensaje de error original y confirmación de que desapareció en Expo Go]

--------------------------------------------------------------------------------------------

Entrada #23
Fecha: 01-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Entender para qué sirven las librerías de selector de fechas, listas desplegables nativas y selección de imágenes del formulario de registro.
Prompt:

npx expo install @react-native-community/datetimepicker @react-native-picker/picker expo-image-picker

Resumen de la respuesta: Claude explicó que datetimepicker muestra el calendario nativo y devuelve objetos Date compatibles con las validaciones de fechas; picker es la lista desplegable nativa, que reemplaza al componente SelectField; y expo-image-picker permite elegir fotos de la galería o la cámara y devuelve su uri. Advirtió que subir las imágenes depende de la decisión pendiente sobre el almacenamiento. Incluyó ejemplos de uso de cada una. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. instalación de las tres librerías, ejemplos de uso].
Modificado / descartado: [completar: p. ej. se usa Picker en lugar de SelectField, o al contrario].
Verificación: [p. ej. npx expo-doctor sin errores; el calendario, la lista y la galería abren en Expo Go]
Archivos y commit: [278153b]
Aprendizaje: Muestra el calendario nativo del celular

--------------------------------------------------------------------------------------------
Entrada #24
Fecha: 02-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Crear un botón reutilizable para las pantallas de la app.
Prompt:

codigo para crear un boton en js

Resumen de la respuesta: Claude explicó que el Button nativo de React Native casi no permite personalizar estilos y entregó el componente AppButton con Pressable, con variantes primary (relleno) y secondary (borde), estados deshabilitado y presionado, indicador de carga (ActivityIndicator) y propiedades de accesibilidad. Incluyó ejemplos de uso en el formulario de registro. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. componente AppButton completo].
Modificado: [completar: p. ej. colores reemplazados por los de ../theme].
Descartado: [completar, o "Nada"].
Archivos y commit: [278153b]
Verificación: [p. ej. el botón responde al toque, se ve atenuado al deshabilitarlo y muestra el indicador mientras loading es true en Expo Go]
Aprendizaje: se utiliza la funcion onPress para que al tocar la pantalla este recuadro tenga funcionalidad

-------------------------------------------------------------------------------------------
Entrada #25
Fecha: 02-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Encontrar el error del componente SelectField construido con @react-native-picker/picker.
Prompt: cual es el error de este codigo : se comparte el codigo a la IA

Resumen de la respuesta: Claude identificó que el archivo no tiene imports: View, Text, StyleSheet, Picker, colors, spacing, typography y radius no están definidos, lo que produce un ReferenceError. Entregó los imports necesarios y advirtió que ../theme debe exportar radius y las propiedades usadas. Sugirió deshabilitar la opción vacía en Android y reemplazar el SelectField anterior hecho con Modal. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. imports agregados].
Modificado / descartado: [completar: p. ej. enabled={false} en la opción vacía].
Archivos y commit: [278153b]
Verificación: [p. ej. la lista se abre en Expo Go, muestra las opciones y el borde cambia de color al haber error]
Aprendizaje: Olvidé traer algunos componentes.

--------------------------------------------------------------------------------------------
Entrada #26
Fecha: 02-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Entender qué es el componente Picker y cómo funciona dentro del formulario de registro.
Prompt:

que es y como funciona Picker

Resumen de la respuesta: Claude explicó que Picker es la lista desplegable nativa de Android e iOS y que funciona como componente controlado: selectedValue indica la opción elegida y onValueChange actualiza el estado. Describió las propiedades de Picker y Picker.Item, las diferencias entre plataformas (diálogo o desplegable en Android, rueda en iOS) y la importancia de que los valores sean del mismo tipo, porque la comparación es estricta. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó: Consulta conceptual; se usó como referencia para el componente SelectField.
Archivos y commit: [278153b]
Verificación: [p. ej. contraste con la documentación de @react-native-picker/picker y prueba del componente en Expo Go]
Aprendizaje: para implementar la lista desplegable ya existe librerias que tiene el codigo, sin tener que crearlo desde cero.

--------------------------------------------------------------------------------------------

Entrada #27
Fecha: 02-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Corregir la función formatDate, que muestra una fecha en formato DD/MM/AAAA.
Prompt:

corrige el siguiente codigo : const formatDate = (date) => { const day = String(date.getDate()).paStart(2, '0'); const month = String(date.getMonth() + 1).padStart(2, '0'); return ${day}/${month}/${date.getFullYear()}; };

Resumen de la respuesta: Claude identificó el error de escritura paStart en lugar de padStart, que produce TypeError: ... is not a function. Agregó una validación para que la función devuelva un texto vacío cuando la fecha es null o inválida, porque los campos de fecha del formulario empiezan en null. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. función corregida con la validación de fecha].
Modificado / descartado: [completar, o "Nada"].
Archivos y commit: [278153b]
Verificación: [p. ej. formatDate(new Date(2000, 4, 7)) devuelve 07/05/2000 y formatDate(null) devuelve un texto vacío]
Aprendizaje: digité mal uno de los comandos paStart en lugar de padStart

--------------------------------------------------------------------------------------------
Entrada #28
Fecha: 02-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Crear un componente reutilizable para agregar fotos en el formulario de registro del conductor.
Prompt:

Estoy haciendo una app en React Native con Expo SDK 58 y la pruebo en Expo Go. Necesito un componente reutilizable en src/components/ImageField.js para agregar fotos en un formulario de registro ayudame a realizarlo

Resumen de la respuesta: Claude creó ImageField con expo-image-picker: al tocarlo ofrece tomar la foto con la cámara o elegirla de la galería, pide los permisos, muestra la vista previa con el recorte indicado (aspect) y permite cambiar o quitar la foto. Sigue la misma interfaz que SelectField (label, value, onChange, error, showError) y tiene forma circular para la foto de perfil. Aclaró que solo guarda la ruta local; la subida depende de la decisión pendiente sobre el almacenamiento. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. componente ImageField completo].
Modificado / descartado: [completar, o "Nada"].
Archivos y commit: [278153b]
Verificación: [p. ej. en Expo Go se tomó una foto con la cámara y otra desde la galería, se vio la vista previa, se quitó la foto y apareció el error al intentar avanzar sin foto]

--------------------------------------------------------------------------------------------

Entrada #29
Fecha: 02-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Corregir el archivo de constantes de tarifas (PRICING) y comisión de la plataforma.
Prompt: corrige este codigo
export const COMMISSION_PERCENT = Math.round(COMMISSION_RATE * 100);
Resumen de la respuesta: Claude identificó que perminute no sigue el camelCase del resto de propiedades (perKm, baseFare), por lo que leer PRICING.perMinute devuelve undefined y el cálculo de la tarifa da NaN; lo corrigió a perMinute. Agregó comentarios con las unidades (COP), Object.freeze para evitar modificaciones accidentales y confirmó que las claves de categoryMultipliers coinciden con los valores de VEHICLE_CATEGORIES. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. corrección de perMinute, comentarios de unidades].
Modificado / descartado: [completar: p. ej. Object.freeze].
Archivos y commit: [f7153e8]
Verificación: [p. ej. PRICING.perMinute devuelve 250 y el cálculo de una tarifa de prueba no da NaN]
Aprendizaje: se siguen las intrucciones del taller

--------------------------------------------------------------------------------------------
Entrada #30
Fecha: 02-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Definir el objeto de estilos que necesita el componente CheckboxField.
Prompt: como quedaria el objeto segun la funcion
Resumen de la respuesta: Claude entregó el objeto styles con las tres claves que usa el componente (container, row y label), siguiendo el mismo patrón de SelectField e ImageField. Explicó que flex: 1 en el texto permite que una etiqueta larga, como la de los términos, salte de línea sin salirse de la pantalla, y advirtió que colors.primary y typography.body deben existir en ../theme. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: [completar: p. ej. objeto styles completo].
Modificado / descartado: [completar, o "Nada"].
Archivos y commit: [f7153e8]
Verificación: [p. ej. en Expo Go la casilla se marca y desmarca al tocarla, el texto largo se ajusta en varias líneas y el error aparece al no aceptar los términos]
Aprendizaje: [completar con tus palabras]

--------------------------------------------------------------------------------------------
Entrada #31
Fecha: 02-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Encontrar y corregir los errores del objeto de estilos de una pantalla.
Prompt: busca los errores y corrigelo
Resumen de la respuesta: Claude encontró tres errores de escritura: borderradius en lugar de borderRadius, marginBotom en lugar de marginBottom y 'rov' en lugar de 'row' en flexDirection. Explicó que las dos primeras propiedades se ignoran sin aviso y que el valor 'rov' genera un error de estilo inválido. Recordó verificar que ../theme exporte spacing.xxl, spacing.md, radius.md, colors.accent y colors.success. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: corrección de las tres propiedades.
Modificado / descartado: [completar, o "Nada"].
Archivos y commit: [f7153e8]
Verificación: [p. ej. la pantalla abre en Expo Go, el resumen tiene bordes redondeados, separación inferior y las filas se muestran en horizontal]

  ------------------------------------------------------------------------------------------

  Entrada 32
Fecha: 02-11-2026
Integrante: Xavier Rua
Herramienta: Claude (Anthropic)
Objetivo: Encontrar el error del bloque que muestra el resumen del estado de cada pestaña del registro.
Prompt:
javascript
<View style={styles.summary}>
        {Object.entries(TAB_NAMES).map(([key, name]) => (
          <View key={key} style={styles.summaryRow}>
            <Ionicons
              name={tabsValid[key] ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={tabsValid[key] ? colors.success : colors.textSecondary}
            />
            <Text style={typography.body}>{name}</Text>
          
        ))}
      </View>
Resumen de la respuesta: Claude identificó que falta cerrar el <View> de cada fila (</View>) antes de ))}, lo que produce un error de sintaxis JSX. Entregó el bloque corregido y recordó que las claves de TAB_NAMES deben coincidir con las de tabsValid y que colors.textSecondary debe existir en ../theme. Enlace a la conversación: [https://claude.ai/chat/d0e7abc7-4be2-438f-aa85-14199af75145]
Qué se usó / modificó / descartó:
Usado tal cual: cierre del <View> de cada fila.
Modificado / descartado: [completar, o "Nada"].
Archivos y commit: [f7153e8]
Verificación: [p. ej. la pantalla compila en Expo Go y muestra cada pestaña con su ícono de completa o pendiente]
Aprendizaje: [completar con tus palabras]