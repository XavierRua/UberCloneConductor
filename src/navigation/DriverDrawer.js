// Menú lateral (Drawer) del conductor con sesión: Inicio, perfil, historial, ganancias y configuración
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import EarningsScreen from '../screens/EarningsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { colors } from '../theme';

const Drawer = createDrawerNavigator();

// Ícono de cada opción del menú (Ionicons)
const DRAWER_ICONS = {
  Home: 'map',
  Profile: 'person',
  History: 'time',
  Earnings: 'cash',
  Settings: 'settings',
};

export default function DriverDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerIcon: ({ color, size }) => (
          <Ionicons name={DRAWER_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Mi perfil' }} />
      <Drawer.Screen name="History" component={HistoryScreen} options={{ title: 'Historial' }} />
      <Drawer.Screen name="Earnings" component={EarningsScreen} options={{ title: 'Ganancias' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configuración' }} />
    </Drawer.Navigator>
  );
}