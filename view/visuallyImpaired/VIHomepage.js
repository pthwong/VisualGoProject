import React from 'react';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Moment from 'react-moment';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
// import Location from '../../components/Location';

function VIHomepage() {
  //   const [email, onChangeText] = useState('');
  //   const [password, onChangeText] = useState('');
  const navigation = useNavigation();

  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  regPress = () => {
    navigation.navigate('VIRegPage');
  };

  visualSuppPress = () => {
    navigation.navigate('VIVisualSuppPage');
  };

  communityPress = () => {
    navigation.navigate('VICommunityPage');
  };

  pandemicPress = () => {
    navigation.navigate('VIPandemicPage');
  };

  settingsPress = () => {
    navigation.navigate('VISettingsPage');
  };

  return (
    <View>
      <Text style={styles.titleChi}>你好 Nathan</Text>
      {/* <TouchableOpacity style={styles.regBtn} onPress={this.regPress}>
        <Text style={styles.btnTxt}>註冊帳戶 Register</Text>
      </TouchableOpacity> */}
      <Text style={styles.titleDate}>{moment().format('ll')}</Text>
      <Text style={styles.titleTime}>{moment().format('LT')}</Text>
      {/* <TouchableOpacity style={styles.btnVisual} onPress={this.viLoginPress}>
        <Text style={styles.btnTxt}>視覺支援</Text>
      </TouchableOpacity> */}
      <SafeAreaView style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Current location</Text>
          <Text style={styles.infoText}>22°C</Text>
          <Text style={styles.infoText}>79%</Text>
          <Text style={styles.infoText}>Cloudy</Text>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{currentLatitude}</Text>
          <Text style={styles.infoText}>{currentLongitude}</Text>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.btnVisual}
            onPress={this.visualSuppPress}>
            <Text style={styles.btnTxt}>視覺支援</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCommunity}
            onPress={this.communityPress}>
            <Text style={styles.btnTxt}>社區資訊</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.btnPandemic}
            onPress={this.pandemicPress}>
            <Text style={styles.btnTxt}>防疫資訊</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSetting}
            onPress={this.settingsPress}>
            <Text style={styles.btnTxt}>設定</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleChi: {
    marginTop: '10%',
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  titleEng: {
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  titleDate: {
    marginTop: '10%',
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  titleTime: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  infoText: {
    margin: 5,
    fontSize: 20,
  },
  btnVisual: {
    backgroundColor: '#ffd63f',
    color: 'black',
    width: '50%',
    height: 150,
    marginLeft: '5%',
    marginRight: '5%',
    paddingTop: '14%',
    borderRadius: 20,
    margin: -10,
    // shadowOpacity: 0.1,
  },
  btnPandemic: {
    backgroundColor: '#ADECC1',
    color: 'black',
    width: '50%',
    height: 150,
    marginLeft: '5%',
    marginRight: '5%',
    paddingTop: '14%',
    borderRadius: 20,
    margin: -10,
    // shadowOpacity: 0.1,
  },
  btnCommunity: {
    backgroundColor: '#97F9F9',
    color: 'black',
    width: '50%',
    height: 150,
    paddingTop: '14%',
    borderRadius: 20,
    margin: -10,
    // shadowOpacity: 0.1,
  },
  btnSetting: {
    backgroundColor: '#c5e1ff',
    color: 'black',
    width: '50%',
    height: 150,
    paddingTop: '14%',
    borderRadius: 20,
    margin: -10,
    // shadowOpacity: 0.1,
  },
  btnTxt: {
    color: 'black',
    textAlign: 'center',
    fontSize: 30,
    shadowOpacity: 0.3,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'space-around',
    marginTop: 10,
    paddingRight: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'space-around',
    height: 100,
    marginTop: 180,
  },
});

export default VIHomepage;
