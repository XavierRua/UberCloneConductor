// AI-assisted: see docs/AI_LOG.md #22
// Navegación principal: sin sesión, Iniciar sesión y Registro; con sesión, el menú lateral del conductor
// Iniciar sesión y Drawer: see docs/AI_LOG.md #N
// Detalle del viaje: see docs/AI_LOG.md #N
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TripDetailScreen from '../screens/TripDetailScreen';
import RegisterTabs from './RegisterTabs';
import DriverDrawer from './DriverDrawer';
import useSession from '../hooks/useSession';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { driverPhone, ready } = useSession();

  // Mientras se lee la sesión guardada en el celular
  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {driverPhone ? (
        <>
          {/* Con sesión: el menú lateral tiene su propio encabezado con el ícono ☰ */}
          <Stack.Screen name="Driver" component={DriverDrawer} options={{ headerShown: false }} />
          <Stack.Screen
            name="TripDetail"
            component={TripDetailScreen}
            options={{ title: 'Detalle del viaje' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesión' }} />
          <Stack.Screen
            name="Register"
            component={RegisterTabs}
            options={{ title: 'Registro de conductor' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});