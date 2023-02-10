import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Homepage from './view/Homepage';

import {View, Button} from 'react-native-elements';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Pages for Visually Impaired
import VIHomepage from './view/visuallyImpaired/VIHomepage';
import VILoginPage from './view/visuallyImpaired/VILoginPage';
import VIRegPage from './view/visuallyImpaired/VIRegPage';
import VIVisualSuppPage from './view/visuallyImpaired/VIVisualSuppPage';
import VICommunityPage from './view/visuallyImpaired/VICommunityPage';
import VIPandemicPage from './view/visuallyImpaired/VIPandemicPage';
import VISettingsPage from './view/visuallyImpaired/VISettingsPage';
import VICameraPage from './view/visuallyImpaired/VICameraPage';

//Pages for Volunteers
import VTLoginPage from './view/volunteer/VTRegPage';
import VTRegPage from './view/volunteer/VTRegPage';
import VTHomepage from './view/volunteer/VTHomepage';
import VTVisualSuppPage from './view/volunteer/VTVisualSuppPage';
import VTCommunityPage from './view/volunteer/VTCommunityPage';
import VTPandemicPage from './view/volunteer/VTPandemicPage';
import VTSettingsPage from './view/volunteer/VTSettingsPage';
import {StyleSheet} from 'react-native';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

function VIBottomTabs() {
  return (
    <BottomTab.Navigator
      initialRouteName="VIHomepage"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#97F9F9',
        tabBarLabelStyle: {
          fontSize: 12,
          height: 20,
        },
        tabBarStyle: {
          height: 85,
          shadowColor: '#171717',
          shadowOffset: {width: -2, height: 4},
          shadowOpacity: 2,
          shadowRadius: 3,
        },
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

function VTBottomTabs() {
  return (
    <BottomTab.Navigator
      initialRouteName="VTHomepage"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#ADECC1',
        tabBarLabelStyle: {
          fontSize: 12,
          height: 20,
        },
        tabBarStyle: {
          height: 85,
          shadowColor: '#171717',
          shadowOffset: {width: -2, height: 4},
          shadowOpacity: 2,
          shadowRadius: 3,
        },

        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let iconOutput;
          let routeName = route.name;

          switch (routeName) {
            case 'VTHomepage':
              iconName = focused ? 'home' : 'home-outline';
              iconOutput = (
                <Ionicons name={iconName} size={size} color={color} />
              );
              break;
            case 'VTVisualSuppPage':
              iconName = focused ? 'eye' : 'eye-outline';
              iconOutput = (
                <Ionicons name={iconName} size={size} color={color} />
              );
              break;
            case 'VTCommunityPage':
              iconName = focused ? 'bell' : 'bell-outline';
              iconOutput = (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
              break;
            case 'VTPandemicPage':
              iconName = focused ? 'face-mask' : 'face-mask-outline';
              iconOutput = (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
              break;
            case 'VTSettingsPage':
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
        name="VTHomepage"
        component={VTHomepage}
        options={{
          headerStyle: {
            backgroundColor: '#ADECC1',
          },
          title: '主頁',
        }}
      />
      <BottomTab.Screen
        name="VTVisualSuppPage"
        component={VTVisualSuppPage}
        options={{
          headerStyle: {
            backgroundColor: '#ADECC1',
          },
          title: '視覺支援',
        }}
      />
      <BottomTab.Screen
        name="VTCommunityPage"
        component={VTCommunityPage}
        options={{
          headerStyle: {
            backgroundColor: '#ADECC1',
          },
          title: '社區資訊',
        }}
      />
      <BottomTab.Screen
        name="VTPandemicPage"
        component={VTPandemicPage}
        options={{
          headerStyle: {
            backgroundColor: '#ADECC1',
          },
          title: '防疫資訊',
        }}
      />
      <BottomTab.Screen
        name="VTSettingsPage"
        component={VTSettingsPage}
        options={{
          headerStyle: {
            backgroundColor: '#ADECC1',
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
      <Stack.Navigator
        options={{
          backgroundColor: '#FFFFFF',
        }}>
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VILoginPage"
          component={VILoginPage}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#97F9F9',
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 2,
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
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 2,
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
        <Stack.Screen
          name="VICameraPage"
          component={VICameraPage}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VTLoginPage"
          component={VTLoginPage}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            headerTitle: '',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VTRegPage"
          component={VTRegPage}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VTPages"
          component={VTBottomTabs}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 2,
  },
});

export default App;
