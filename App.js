import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider } from './src/context/SessionContext';
import { RegisterProvider } from './src/context/RegisterContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Sesión: qué conductor está registrado en este celular */}
      <SessionProvider>
        {/* Registro: datos de las tres pestañas mientras se llenan */}
        <RegisterProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </RegisterProvider>
      </SessionProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
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