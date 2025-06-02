import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppContext} from '../contexts/AppContext';
import {useProfile} from '../hooks/useProfile';
import Home from '../screens/Home';
import CreateProfile from '../screens/CreateProfile';

const RootStack = createNativeStackNavigator();

export default function RootNavigation() {
  const useProfileHook = useProfile();

  return (
    <AppContext.Provider
      value={{
        profileHook: useProfileHook,
      }}>
      <NavigationContainer>
        <RootStack.Navigator>
          {useProfileHook.profile ? (
            <RootStack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false}}
            />
          ) : (
            <RootStack.Screen
              name="CreateProfile"
              component={CreateProfile} // Replace with your Onboarding component
              options={{headerShown: false}}
            />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
