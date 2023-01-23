import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Homepage from './view/Homepage';
import VILoginPage from './view/visuallyImpaired/VILoginPage';
import VIRegPage from './view/visuallyImpaired/VIRegPage';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="viLoginPage" component={VILoginPage} />
        <Stack.Screen name="viRegPage" component={VIRegPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
