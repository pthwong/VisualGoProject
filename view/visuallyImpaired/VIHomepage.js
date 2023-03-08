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
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
// import Location from '../../components/Location';

function VIHomepage() {
  //   const [email, onChangeText] = useState('');
  //   const [password, onChangeText] = useState('');
  const navigation = useNavigation();

  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(null);

  const [weatherData, setWeatherData] = useState(null);

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
        timeout: 15000,
        maximumAge: 10000,
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      setCurrentDate(
        new Intl.DateTimeFormat('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(currentTime),
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Fetch initial data
    fetchData();

    // Set up interval to fetch new data every hour
    const interval = setInterval(() => {
      fetchData();
    }, 60 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    // Get current location using Geolocation API
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;

        // Fetch weather data from OpenWeatherAPI
        const API_KEY = 'b11ed6c4df4f6643fcc67dc4711e7005';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=zh_tw`,
        );
        const responseData = await response.json();

        console.log('Getting data OK: \n', responseData);

        // Extract temperature and humidity data from the response
        const temperature = responseData.main.temp;
        const humidity = responseData.main.humidity;
        const weather = responseData.weather[0].description;
        const location = responseData.name;
        const icon = responseData.weather[0].icon;

        // Update state with the new weather data
        setWeatherData({temperature, humidity, weather, location, icon});
      },
      error => console.log('Getting data Error: \n', error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

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
      <Text style={styles.titleDate}>{currentDate}</Text>
      <Text style={styles.titleTime}>
        {currentTime.toLocaleTimeString([], {
          hour12: false,
          timeStyle: 'short',
        })}
      </Text>
      {/* <TouchableOpacity style={styles.btnVisual} onPress={this.viLoginPress}>
        <Text style={styles.btnTxt}>視覺支援</Text>
      </TouchableOpacity> */}
      <SafeAreaView style={styles.container}>
        <View style={styles.infoContainer}>
          {weatherData ? (
            <>
              <Text style={styles.infoText}>
                {Math.round(weatherData.temperature)}°C
              </Text>
              <Text style={styles.infoText}>{weatherData.humidity}%</Text>
              <Image
                // source={{uri: 'https://openweathermap.org/img/wn/02n@2x.png'}}
                source={{
                  uri: `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`,
                }}
                accessible={true}
                accessibilityLabel={weatherData.weather}
                style={{margin: 5, width: 50, height: 50}}
              />
            </>
          ) : (
            <Text>Loading...</Text>
          )}
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
    marginTop: '5%',
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
    marginTop: '5%',
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
