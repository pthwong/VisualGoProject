import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoad = ({navigation}) => {
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const viToken = await AsyncStorage.getItem('viToken');
    const vtToken = await AsyncStorage.getItem('vtToken');

    if (viToken) {
      // Token found, navigate to VIHomepage
      navigation.replace('VIHomepage');
    } else if (vtToken) {
      navigation.replace('VTHomepage');
    } else {
      // No token found, navigate to Homepage
      navigation.replace('Homepage');
    }
  };

  return (
    <View>
      <ActivityIndicator />
    </View>
  );
};

export default AuthLoad;
