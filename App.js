import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RegisterProvider } from './src/context/RegisterContext';
import RegisterTabs from './src/navigation/RegisterTabs';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* El contexto envuelve la navegación para que las tres pestañas compartan los datos */}
      <RegisterProvider>
        <NavigationContainer>
          <RegisterTabs />
        </NavigationContainer>
      </RegisterProvider>
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
