// AI-assisted: see docs/AI_LOG.md #18
// Navegación Tab del registro: Datos personales, Vehículo y Documentos (sección 2 del enunciado)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PersonalDataScreen from '../screens/PersonalDataScreen';
import VehicleScreen from '../screens/VehicleScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import useRegister from '../hooks/useRegister';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

// Ícono de cada pestaña (Ionicons)
const TAB_ICONS = {
  PersonalData: 'person',
  Vehicle: 'car',
  Documents: 'document-text',
};

export default function RegisterTabs() {
  const { tabsValid } = useRegister();

  // Muestra un ✓ verde en la pestaña cuando está completa y válida
  const badge = (isValid) => (isValid ? '✓' : undefined);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarBadgeStyle: { backgroundColor: colors.success, color: colors.primaryText },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="PersonalData"
        component={PersonalDataScreen}
        options={{ title: 'Datos personales', tabBarBadge: badge(tabsValid.personalData) }}
      />
      <Tab.Screen
        name="Vehicle"
        component={VehicleScreen}
        options={{ title: 'Vehículo', tabBarBadge: badge(tabsValid.vehicle) }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{ title: 'Documentos y pagos', tabBarBadge: badge(tabsValid.documents) }}
      />
    </Tab.Navigator>
  );
}