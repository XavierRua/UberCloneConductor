import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from './src/context/LanguageContext';
import { SessionProvider } from './src/context/SessionContext';
import { ActiveTripProvider } from './src/context/ActiveTripContext';
import { RegisterProvider } from './src/context/RegisterContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    // Necesario para los gestos del menú lateral (deslizar para abrir)
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Idioma de la app, guardado como preferencia en AsyncStorage */}
        <LanguageProvider>
          {/* Sesión: qué conductor está registrado en este celular */}
          <SessionProvider>
            {/* Viaje activo del conductor, escuchado en tiempo real */}
            <ActiveTripProvider>
              {/* Registro: datos de las tres pestañas mientras se llenan */}
              <RegisterProvider>
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
              </RegisterProvider>
            </ActiveTripProvider>
          </SessionProvider>
        </LanguageProvider>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Este archivo es el punto de entrada de la app. Contiene la navegación y el contexto del 
// registro.

// cambios ejecutados en este archivo:

// Plantilla original de Expo
// prueba de conexion a firebase
// prueba de validaciones
// version definitiva con navegacion (las tres pestañas del registro) y contexto (para compartir los datos entre las tres pestañas)
// Punto de entrada de la app: proveedores globales y navegación
// Punto de entrada de la app: proveedores globales y navegación
// GestureHandlerRootView para el menú lateral