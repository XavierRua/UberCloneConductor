import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import EarningsScreen from '../screens/EarningsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import useLanguage from '../hooks/useLanguage';
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
  const { t } = useLanguage();

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
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: t('menu.home') }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: t('menu.profile') }} />
      <Drawer.Screen name="History" component={HistoryScreen} options={{ title: t('menu.history') }} />
      <Drawer.Screen name="Earnings" component={EarningsScreen} options={{ title: t('menu.earnings') }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: t('menu.settings') }} />
    </Drawer.Navigator>
  );
}