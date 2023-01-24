import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Homepage from './view/Homepage';
import VILoginPage from './view/visuallyImpaired/VILoginPage';
import VIRegPage from './view/visuallyImpaired/VIRegPage';
import {View, Button} from 'react-native-elements';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Page for Visually Impaired
import VIHomepage from './view/visuallyImpaired/VIHomepage';
import VIVisualSuppPage from './view/visuallyImpaired/VIVisualSuppPage';
import VICommunityPage from './view/visuallyImpaired/VICommunityPage';
import VIPandemicPage from './view/visuallyImpaired/VIPandemicPage';
import VISettingsPage from './view/visuallyImpaired/VISettingsPage';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

function VIBottomTabs() {
  return (
    <BottomTab.Navigator
      initialRouteName="VIHomepage"
      // tabBarOptions={{
      //   activeTintColor: '#97F9F9',
      //   labelStyle: {
      //     fontSize: 10,
      //     height: 20,
      //   },
      // }}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let iconOutput;
          let routeName = route.name;

          switch (routeName) {
            case 'VIHomepage':
              iconName = focused ? 'home' : 'home-outline';
              iconOutput = (
                <Ionicons name={iconName} size={size} color={color} />
              );
              break;
            case 'VIVisualSuppPage':
              iconName = focused ? 'eye' : 'eye-outline';
              iconOutput = (
                <Ionicons name={iconName} size={size} color={color} />
              );
              break;
            case 'VICommunityPage':
              iconName = focused ? 'bell' : 'bell-outline';
              iconOutput = (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
              break;
            case 'VIPandemicPage':
              iconName = focused ? 'face-mask' : 'face-mask-outline';
              iconOutput = (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
              break;
            case 'VISettingsPage':
              iconName = focused ? 'settings' : 'settings-outline';
              iconOutput = (
                <Ionicons name={iconName} size={size} color={color} />
              );
              break;
          }

          return iconOutput;
        },
      })}>
      <BottomTab.Screen
        name="VIHomepage"
        component={VIHomepage}
        options={{
          headerStyle: {
            backgroundColor: '#97F9F9',
          },
          title: '主頁',
        }}
      />
      <BottomTab.Screen
        name="VIVisualSuppPage"
        component={VIVisualSuppPage}
        options={{
          headerStyle: {
            backgroundColor: '#97F9F9',
          },
          title: '視覺支援',
        }}
      />
      <BottomTab.Screen
        name="VICommunityPage"
        component={VICommunityPage}
        options={{
          headerStyle: {
            backgroundColor: '#97F9F9',
          },
          title: '社區資訊',
        }}
      />
      <BottomTab.Screen
        name="VIPandemicPage"
        component={VIPandemicPage}
        options={{
          headerStyle: {
            backgroundColor: '#97F9F9',
          },
          title: '防疫資訊',
        }}
      />
      <BottomTab.Screen
        name="VISettingsPage"
        component={VISettingsPage}
        options={{
          headerStyle: {
            backgroundColor: '#97F9F9',
          },
          title: '設定',
        }}
      />
    </BottomTab.Navigator>
  );
}

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
        <Stack.Screen
          name="VIPages"
          component={VIBottomTabs}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
