import React from 'react';
import {useState, useEffect, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

function VTSettingsPage() {
  const navigation = useNavigation();

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [district, setDistrict] = useState(null);
  const [building, setBuilding] = useState(null);

  useEffect(() => {
    const districtList = [
      {label: '中西區', value: 'CEW'},
      {label: '東區', value: 'EAS'},
      {label: '南區', value: 'SOU'},
      {label: '灣仔區', value: 'WAC'},
      {label: '九龍城區', value: 'KOC'},
      {label: '觀塘區', value: 'KWT'},
      {label: '深水埗區', value: 'SSP'},
      {label: '黃大仙區', value: 'WTS'},
      {label: '油尖旺區', value: 'YTM'},
      {label: '離島區', value: 'ISL'},
      {label: '葵青區', value: 'KWA'},
      {label: '北區', value: 'NOR'},
      {label: '西貢區', value: 'SAK'},
      {label: '沙田區', value: 'SHT'},
      {label: '大埔區', value: 'TAP'},
      {label: '荃灣區', value: 'TSW'},
      {label: '屯門區', value: 'TUM'},
      {label: '元朗區', value: 'YUL'},
      {label: '全港', value: 'HOK'},
    ];

    const getDistrictName = async () => {
      let districtID = await AsyncStorage.getItem('districtID');
      districtID = districtID.replace(/['"]+/g, '');
      const districtName = districtList.find(
        districtNameValue => districtNameValue.value === districtID,
      );

      return districtName ? districtName.label : 'District not found';
    };

    const fetchUserData = async () => {
      let storedName = await AsyncStorage.getItem('vtName');
      if (storedName) {
        storedName = storedName.replace(/['"]+/g, '');
        setName(storedName);
      }
      let storedEmail = await AsyncStorage.getItem('vtEmail');
      if (storedEmail) {
        storedEmail = storedEmail.replace(/['"]+/g, '');
        setEmail(storedEmail);
      }
      let storedBuilding = await AsyncStorage.getItem('vtBuilding');
      if (storedBuilding) {
        storedBuilding = storedBuilding.replace(/['"]+/g, '');
        setBuilding(storedBuilding);
      }
      setDistrict(await getDistrictName());
    };

    fetchUserData();
  }, []);

  const logoutAc = async () => {
    await AsyncStorage.removeItem('vtEmail');
    await AsyncStorage.removeItem('vtName');
    await AsyncStorage.removeItem('districtID');
    await AsyncStorage.removeItem('vtBuilding');
    await AsyncStorage.removeItem('vtToken');
    console.log('Storage item removed');
    navigation.reset({
      index: 0,
      routes: [{name: 'VTLoginPage'}],
    });
  };

  const logoutPress = () => {
    {
      Alert.alert(
        '確定登出此義工帳戶？',
        '',
        [
          {
            text: '取消',
            onPress: () => console.log('Cancel Pressed'),
          },
          {
            text: '確定',
            onPress: () => {
              logoutAc();
            },
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <View>
      <View style={styles.infoContainer}>
        <View style={styles.infoLeftContainer}>
          <Text style={styles.title}>{name}</Text>
        </View>
        <View style={styles.infoRightContainer}>
          <Text style={styles.subTitle}>義工</Text>
        </View>
      </View>
      <View style={{paddingLeft: '5%'}}>
        <Text style={styles.subTitle}>{email}</Text>
      </View>
      <View style={styles.hLine} />
      <>
        {name ? (
          <>
            <TouchableOpacity
              onPress={() => {
                console.log('pressed');
              }}>
              <View style={styles.infoContainer}>
                <Text
                  style={styles.infoLeftContainer}
                  accessible={true}
                  accessibilityLabel="你的稱呼：">
                  名稱
                </Text>
                <Text style={styles.infoRightContainer}>{name}</Text>
                <Ionicons name={'chevron-forward-outline'} size={30} />
              </View>
            </TouchableOpacity>
            <View style={styles.hLine} />
          </>
        ) : null}
      </>

      <>
        {email ? (
          <>
            <TouchableOpacity
              onPress={() => {
                console.log('pressed');
              }}>
              <View style={styles.infoContainer}>
                <Text
                  style={styles.infoLeftContainer}
                  accessible={true}
                  accessibilityLabel="你的電郵地址：">
                  電郵地址
                </Text>
                <Text style={styles.infoRightContainer}>{email}</Text>
                <Ionicons name={'chevron-forward-outline'} size={30} />
              </View>
            </TouchableOpacity>
            <View style={styles.hLine} />
          </>
        ) : null}
      </>

      <>
        {district ? (
          <>
            <TouchableOpacity
              onPress={() => {
                console.log('pressed');
              }}>
              <View style={styles.infoContainer}>
                <Text
                  style={styles.infoLeftContainer}
                  accessible={true}
                  accessibilityLabel="你的地區：">
                  地區
                </Text>
                <Text style={styles.infoRightContainer}>{district}</Text>
                <Ionicons name={'chevron-forward-outline'} size={30} />
              </View>
            </TouchableOpacity>
            <View style={styles.hLine} />
          </>
        ) : null}
      </>

      <>
        {building ? (
          <>
            <TouchableOpacity
              onPress={() => {
                console.log('pressed');
              }}>
              <View style={styles.infoContainer}>
                <Text
                  style={styles.infoLeftContainer}
                  accessible={true}
                  accessibilityLabel="你的大廈或屋苑：">
                  大廈/屋苑
                </Text>
                <Text style={styles.infoRightContainer}>{building}</Text>
                <Ionicons name={'chevron-forward-outline'} size={30} />
              </View>
            </TouchableOpacity>
            <View style={styles.hLine} />
          </>
        ) : null}
      </>
      <TouchableOpacity
        onPress={() => {
          console.log('pressed');
        }}>
        <View style={styles.infoContainer}>
          <Text
            style={styles.infoLeftContainer}
            accessible={true}
            accessibilityLabel="更改密碼">
            更改密碼
          </Text>
          <Ionicons name={'chevron-forward-outline'} size={30} />
        </View>
      </TouchableOpacity>
      <View style={styles.hLine} />
      <TouchableOpacity
        onPress={() => {
          console.log('pressed');
        }}>
        <View style={styles.infoContainer}>
          <Text
            style={styles.infoLeftContainer}
            accessible={true}
            accessibilityLabel="其他資訊">
            其他資訊
          </Text>
          <Ionicons name={'chevron-forward-outline'} size={30} />
        </View>
      </TouchableOpacity>
      <View style={styles.hLine} />
      <TouchableOpacity onPress={logoutPress}>
        <View style={styles.infoContainer}>
          <Text
            style={styles.infoLeftContainer}
            accessible={true}
            accessibilityLabel="登出義工帳戶">
            登出
          </Text>
          <Ionicons name={'chevron-forward-outline'} size={30} />
        </View>
      </TouchableOpacity>
      <View style={styles.hLine} />

      {/* <TouchableOpacity style={styles.regBtn}>
        <Text style={styles.btnTxt}>登出</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: '10%',
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  subTitle: {
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 22,
    color: 'black',
  },
  titleEng: {
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  textField: {
    fontSize: 18,
    color: 'black',
    marginBottom: '5%',
  },
  inputField: {
    border: 1,
    fontSize: 25,
    marginTop: '20%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  loginBtn: {
    backgroundColor: '#97F9F9',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '3%',
    marginTop: '10%',
    borderRadius: 50,
    // shadowOpacity: 0.1,
  },
  regBtn: {
    backgroundColor: '#ffd63f',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '3%',
    marginTop: '10%',
    borderRadius: 50,
    // shadowOpacity: 0.1,
  },
  btnTxt: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    shadowOpacity: 0.2,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'space-between',
    marginLeft: '3%',
    marginRight: '3%',
  },
  infoLeftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    fontSize: 25,
    color: '#000000',
    paddingLeft: '5%',
  },
  infoRightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    fontSize: 25,
    color: 'black',
    textAlign: 'right',
    paddingRight: '10%',
  },
  hLine: {
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: '4%',
    marginTop: '4%',
    marginLeft: '4%',
    marginRight: '4%',
  },
});

export default VTSettingsPage;
