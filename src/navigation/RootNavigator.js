import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterTabs from './RegisterTabs';
import ProfileScreen from '../screens/ProfileScreen';
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
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Mi perfil' }} />
      ) : (
        <Stack.Screen name="Register" component={RegisterTabs} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});

// Navegación principal: sin sesión muestra el registro; con sesión, el perfil del conductor