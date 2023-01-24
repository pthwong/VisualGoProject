import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Homepage from './view/Homepage';
import VILoginPage from './view/visuallyImpaired/VILoginPage';
import VIRegPage from './view/visuallyImpaired/VIRegPage';
import {View, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="VILoginPage"
          component={VILoginPage}
          options={{
            headerShown: true,
            // headerLeft: () => (
            //   <Icon
            //     name="angle-left"
            //     size={30}
            //     color="#1841c7"
            //     onPress={navigation.goBack(null)}
            //   />
            // ),
            headerStyle: {
              backgroundColor: '#97F9F9',
            },
            headerTitle: '',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VIRegPage"
          component={VIRegPage}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#97F9F9',
            },
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
