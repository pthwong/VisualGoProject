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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function VIVisualSuppPage() {
  //   const [email, onChangeText] = useState('');
  //   const [password, onChangeText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = () => {
    navigation.goBack();
    return true;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{marginLeft: 4}}
          accessible={true}
          accessibilityLabel="返回視障人士主頁">
          <Ionicons name="chevron-back-outline" size={40} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  barcodeScannerPress = () => {
    navigation.navigate('VIBarcodeScannerPage');
  };
  priceTagScannerPress = () => {
    navigation.navigate('VIPriceTagScannerPage');
  };
  // objDetectPress = () => {
  //   navigation.navigate('VIObjectDetectPage');
  // };

  return (
    <View>
      <Text style={styles.titleChi}>視覺支援頁面</Text>
      <Text style={styles.titleEng}>Visual Support</Text>
      <TouchableOpacity
        style={styles.barcodeBtn}
        onPress={this.barcodeScannerPress}>
        <Text style={styles.btnTxt}>產品條碼掃描</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.barcodeBtn}
        onPress={this.priceTagScannerPress}>
        <Text style={styles.btnTxt}>價錢牌識別</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.barcodeBtn} onPress={this.objDetectPress}>
        <Text style={styles.btnTxt}>物件識別</Text>
      </TouchableOpacity> */}
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
  barcodeBtn: {
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
});

export default VIVisualSuppPage;
