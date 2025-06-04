import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeIcon from '../components/ui/HomeIcon';
import { AppContext } from '../contexts/AppContext';
import { useProfile } from '../hooks/useProfile';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import PillIcon from '../components/ui/PillIcon';
import MedicamentsDashboardScreen from '../screens/MedicamentsDashboardScreen';
import { useMedications } from '../hooks/useMedications';

const Tab = createBottomTabNavigator();

export default function RootNavigation() {
  const profileHook = useProfile();
  const medicationsHook = useMedications();

  return (
    <AppContext.Provider
      value={{
        profileHook,
        medicationsHook,
      }}
    >
      {profileHook.profile ? (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                height: 60,
              },
              tabBarItemStyle: {
                paddingVertical: 5,
              },
              tabBarLabelStyle: {
                fontFamily: 'Inter_24pt-SemiBold',
                fontSize: 12,
              },
              headerShown: false,
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: HomeIcon,
                title: 'Inicio',
              }}
            />
            <Tab.Screen
              name="Medicaments"
              component={MedicamentsDashboardScreen}
              options={{
                tabBarIcon: PillIcon,
                title: 'Medicamentos',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      ) : (
        <CreateProfileScreen />
      )}
    </AppContext.Provider>
  );
}
