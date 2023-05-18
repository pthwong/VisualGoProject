import * as React from 'react';
import {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Homepage from './view/Homepage';

import {View, Button} from 'react-native-elements';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AsyncStorage} from 'react-native';
import {Text} from 'react-native-elements';
import Toast, {BaseToast} from 'react-native-toast-message-large';

import AuthLoad from './view/AuthLoad';
import LocationSearch from './view/LocationSearch';

//Pages for Visually Impaired
import VIHomepage from './view/visuallyImpaired/VIHomepage';
import VILoginPage from './view/visuallyImpaired/VILoginPage';
import VIRegPage from './view/visuallyImpaired/VIRegPage';
import VIVisualSuppPage from './view/visuallyImpaired/VIVisualSuppPage';
import VICommunityPage from './view/visuallyImpaired/VICommunityPage';
import VISettingsPage from './view/visuallyImpaired/VISettingsPage';
import VIBarcodeScannerPage from './view/visuallyImpaired/VIBarcodeScannerPage';
import VIPriceTagScannerPage from './view/visuallyImpaired/VIPriceTagScannerPage';
import VIProductInfoBarcode from './view/visuallyImpaired/VIProductInfoBarcode';

//Pages for Volunteers
import VTLoginPage from './view/volunteer/VTLoginPage';
import VTRegPage from './view/volunteer/VTRegPage';
import VTHomepage from './view/volunteer/VTHomepage';
import VTVisualSuppPage from './view/volunteer/VTVisualSuppPage';
import VTCommunityPage from './view/volunteer/VTCommunityPage';
import VTSettingsPage from './view/volunteer/VTSettingsPage';
import VTBarcodeScannerProductPage from './view/volunteer/VTBarcodeScannerProductPage';
import VTBarcodeScannerNutritionPage from './view/volunteer/VTBarcodeScannerNutritionPage';
import VTAddProductInfoPage from './view/volunteer/VTAddProductInfoPage';
import VTAddNutritionInfoPage from './view/volunteer/VTAddNutritionInfoPage';
import VTEditProductInfoPage from './view/volunteer/VTEditProductInfoPage';
import VTEditNutritionInfoPage from './view/volunteer/VTEditNutritionInfoPage';
import VTAddNewsPage from './view/volunteer/VTAddNewsPage';
import VTEditNewsPage from './view/volunteer/VTEditNewsPage';

import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const toastConfig = {
  success: ({text1, text2, props, ...rest}) => (
    <BaseToast
      {...rest}
      style={{borderLeftColor: 'green'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 18, // Adjust the font size here
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 13, // Adjust the font size for text2 here
        fontWeight: '300',
      }}
      text1={text1}
      text2={text2}
      {...props}
    />
  ),
  error: ({text1, text2, props, ...rest}) => (
    <BaseToast
      {...rest}
      style={{borderLeftColor: 'pink'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 18, // Adjust the font size here
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 13, // Adjust the font size for text2 here
        fontWeight: '300',
      }}
      text1={text1}
      text2={text2}
      {...props}
    />
  ),
  // ... other toast types
};

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

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
          headerShown: false,
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
        options={({navigation}) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('VTAddNewsPage')}
              style={{marginRight: 10}}>
              <Ionicons
                name={'add-outline'}
                size={30}
                onPress={() => navigation.navigate('VTAddNewsPage')}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#ADECC1',
          },
          title: '社區資訊',
        })}
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
        }}
        initialRouteName="AuthLoad">
        <Stack.Screen
          name="AuthLoad"
          component={AuthLoad}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="LocationSearch"
          component={LocationSearch}
          options={{
            headerTitle: '地點搜尋',
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
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
            headerTitle: '視障人士登入',
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
          name="VIHomepage"
          component={VIHomepage}
          options={{
            headerShown: false,
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
          name="VIBarcodeScannerPage"
          component={VIBarcodeScannerPage}
          options={{
            gestureEnabled: false,
            headerTitle: '產品條碼掃描',
            headerStyle: {
              backgroundColor: '#97F9F9',
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 2,
            },
          }}
        />
        <Stack.Screen
          name="VIVisualSuppPage"
          component={VIVisualSuppPage}
          options={{
            gestureEnabled: false,
            headerTitle: '視覺支援',
            backgroundColor: '#97F9F9',
            headerStyle: {
              backgroundColor: '#97F9F9',
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 2,
            },
          }}
        />
        <Stack.Screen
          name="VIProductInfoBarcode"
          component={VIProductInfoBarcode}
          options={{
            gestureEnabled: false,
            headerTitle: '產品資訊',
            headerStyle: {
              backgroundColor: '#97F9F9',
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 2,
            },
          }}
        />
        <Stack.Screen
          name="VIPriceTagScannerPage"
          component={VIPriceTagScannerPage}
          options={{
            gestureEnabled: false,
            headerTitle: '價錢牌識別',
            headerStyle: {
              backgroundColor: '#97F9F9',
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 2,
            },
          }}
        />
        <Stack.Screen
          name="VICommunityPage"
          component={VICommunityPage}
          options={{
            headerTitle: '社區資訊',
            gestureEnabled: false,
            backgroundColor: '#97F9F9',
            headerStyle: {
              backgroundColor: '#97F9F9',
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 2,
            },
          }}
        />
        <Stack.Screen
          name="VISettingsPage"
          component={VISettingsPage}
          options={{
            gestureEnabled: false,
            backgroundColor: '#97F9F9',
            headerTitle: '設定',
            headerStyle: {
              backgroundColor: '#97F9F9',
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 2,
            },
          }}
        />
        <Stack.Screen
          name="VTLoginPage"
          component={VTLoginPage}
          options={{
            headerLeft: () => null,
            headerShown: true,
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            headerTitle: '義工登入',
            gestureEnabled: false,
          }}
          // initialParams={{navigateToVTHomepage: navigateToVTHomepage}}
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
          name="VTBarcodeScannerPage"
          component={VTBarcodeScannerProductPage}
          options={{
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            title: '添加或更新超市產品資訊',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VTBarcodeScannerNutritionPage"
          component={VTBarcodeScannerNutritionPage}
          options={{
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            title: '添加或更新超市產品營養資訊',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="VTAddProductInfoPage"
          component={VTAddProductInfoPage}
          options={{
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            title: '建立超市產品資訊',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VTAddNutritionInfoPage"
          component={VTAddNutritionInfoPage}
          options={{
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            title: '建立超市產品的營養資訊',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VTEditProductInfoPage"
          component={VTEditProductInfoPage}
          options={{
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            title: '更新超市產品資訊',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VTEditNutritionInfoPage"
          component={VTEditNutritionInfoPage}
          options={{
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            title: '更新營養資訊',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VTAddNewsPage"
          component={VTAddNewsPage}
          options={{
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            title: '建立社區資訊',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VTEditNewsPage"
          component={VTEditNewsPage}
          options={{
            headerStyle: {
              backgroundColor: '#ADECC1',
            },
            title: '更新社區資訊',
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
      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
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
