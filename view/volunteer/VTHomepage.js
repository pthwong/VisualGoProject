import React from 'react';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Image,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';

function VTHomepage() {
  const navigation = useNavigation();

  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(null);

  const [weatherData, setWeatherData] = useState(null);
  const [pandemicNoCases, setPandemicNoCases] = useState(null);

  const [name, setName] = useState(null);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    const fetchName = async () => {
      let storedName = await AsyncStorage.getItem('vtName');
      if (storedName) {
        storedName = storedName.replace(/['"]+/g, '');
        setName(storedName);
      }
    };

    fetchName();
  }, []);

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
        new Intl.DateTimeFormat('zh-HK', {
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
    fetchWeatherData();
    fetchPandemicData();

    // Set up interval to fetch new data every hour
    const interval = setInterval(() => {
      fetchWeatherData();
    }, 60 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  async function fetchWeatherData() {
    // Get current location using Geolocation API
    try {
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;

          // Fetch weather data from OpenWeatherAPI
          const API_KEY = 'b11ed6c4df4f6643fcc67dc4711e7005';
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=zh_tw`,
          );
          const responseData = await response.json();

          console.log(
            'Response url:',
            response,
            '\nGetting data OK: \n',
            responseData,
          );

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
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 30000},
      );
    } catch (error) {
      console.warn('Error:\n', error);
    }
  }

  async function fetchPandemicData() {
    try {
      const response = await fetch(
        `https://chp-dashboard.geodata.gov.hk/covid-19/data/keynum.json`,
      );
      const responseData = await response.json();
      const noOfCases = responseData.Confirmed_Delta;
      setPandemicNoCases(noOfCases);
    } catch (error) {
      console.warn('Pandemic data fetched error: \n', error);
    }
  }

  regPress = () => {
    navigation.navigate('VIRegPage');
  };

  visualSuppPress = () => {
    navigation.navigate('VTVisualSuppPage');
  };

  visualSuppPress2 = () => {
    navigation.navigate('VTVisualSuppPage');
  };

  communityPress = () => {
    navigation.navigate('VTCommunityPage');
  };

  pandemicPress = () => {
    navigation.navigate('VTPandemicPage');
  };

  settingsPress = () => {
    navigation.navigate('VTSettingsPage');
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.titleDate}>{currentDate}</Text>
        <Text style={styles.titleTime}>
          {currentTime.toLocaleTimeString([], {
            hour12: false,
            timeStyle: 'short',
          })}
        </Text>
      </View>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          {weatherData ? (
            <>
              <Text
                style={styles.info}
                accessible={true}
                accessibilityLabel={`氣溫: ${Math.round(
                  weatherData.temperature,
                )}°C`}>
                {Math.round(weatherData.temperature)}°C
              </Text>
              <Text
                style={styles.info}
                accessible={true}
                accessibilityLabel={`相對濕度: ${Math.round(
                  weatherData.humidity,
                )}%`}>
                {weatherData.humidity}%
              </Text>
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`,
                }}
                accessible={true}
                accessibilityLabel={weatherData.weather}
                style={{width: 40, height: 40}}
              />
            </>
          ) : (
            <Text style={styles.info}>Loading...</Text>
          )}
        </View>
        <View style={{padding: 10}}></View>
        <View style={styles.infoContainer}>
          <Image
            source={require('./../../assets/pandemic.png')}
            style={{width: 30, height: 30, marginLeft: '5%', marginRight: '5%'}}
            accessible={true}
            accessibilityLabel="每日新冠病毒疫情數字"
          />
          <Ionicons
            name="triangle"
            size={30}
            color="red"
            accessible={true}
            accessibilityLabel={`疫情數字:多${pandemicNoCases}宗新冠病毒個案`}
          />
          <Text
            style={styles.info}
            accessible={true}
            accessibilityLabel={`疫情數字:多${pandemicNoCases}宗新冠病毒個案`}>
            {pandemicNoCases}
          </Text>
        </View>
        <Text
          style={styles.titleChi}
          accessibile={true}
          accessibilityLabel={`你好，${name}，歡迎使用，請選取下列功能`}>
          你好 {name}
        </Text>
      </View>

      <ScrollView style={styles.subContainer}>
        <TouchableOpacity
          style={[
            styles.btnVisual2,
            {
              backgroundColor: '#ADECC1',
              opacity: 1,
            },
          ]}
          onPress={this.visualSuppPress2}>
          <Text style={styles.btnTxt}>視覺支援</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnVisual2,
            {
              backgroundColor: '#ADECC1',
              opacity: 1,
            },
          ]}
          onPress={this.communityPress}>
          <Text style={styles.btnTxt}>社區資訊</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btnVisual2,
            {
              backgroundColor: '#ADECC1',
              opacity: 1,
            },
          ]}
          onPress={this.settingsPress}>
          <Text style={styles.btnTxt}>設定</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADECC1',
  },
  subContainer: {
    marginTop: -280,
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 70,
  },
  titleChi: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 40,
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
    marginTop: '15%',
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
  },
  titleTime: {
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
  },
  info: {
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
  },
  infoText: {
    margin: 5,
    fontSize: 25,
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
  },
  btnVisual2: {
    backgroundColor: '#ffd63f',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '4%',
    marginTop: '10%',
    borderRadius: 50,
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
  },
  btnCommunity: {
    backgroundColor: '#ADECC1',
    color: 'black',
    width: '50%',
    height: 150,
    paddingTop: '14%',
    borderRadius: 20,
    margin: -10,
  },
  btnSetting: {
    backgroundColor: '#c5e1ff',
    color: 'black',
    width: '50%',
    height: 150,
    paddingTop: '14%',
    borderRadius: 20,
    margin: -10,
  },
  btnTxt: {
    color: 'black',
    textAlign: 'center',
    fontSize: 30,
    shadowOpacity: 0.3,
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'space-around',
    paddingRight: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'space-around',
    height: 100,
    marginTop: 120,
  },
});

export default VTHomepage;
