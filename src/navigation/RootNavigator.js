import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TripDetailScreen from '../screens/TripDetailScreen';
import RegisterTabs from './RegisterTabs';
import DriverDrawer from './DriverDrawer';
import useSession from '../hooks/useSession';
import useLanguage from '../hooks/useLanguage';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { driverPhone, ready } = useSession();
  const { t } = useLanguage();

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
            options={{ title: t('screens.tripDetail') }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: t('screens.login') }} />
          <Stack.Screen
            name="Register"
            component={RegisterTabs}
            options={{ title: t('screens.register') }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});