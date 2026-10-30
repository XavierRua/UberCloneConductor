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