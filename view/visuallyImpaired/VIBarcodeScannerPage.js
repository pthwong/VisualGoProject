import React from 'react';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  Barcodes,
  useScanBarcodes,
  BarcodeFormat,
  scanBarcodes,
} from 'vision-camera-code-scanner';
import {RNHoleView} from 'react-native-hole-view';

function VIBarcodeScannerPage() {
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [isScanned, setIsScanned] = useState(false);
  const devices = useCameraDevices();
  const cameraDevice = devices.back;

  const [productInfo, setProductInfo] = useState('');

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  // async function fetchData() {
  //   // Get current location using Geolocation API
  //   try {
  //       async barcode => {
  //         // Fetch weather data from OpenWeatherAPI
  //         const response = await fetch(
  //           `https://www.barcodeplus.com.hk/eid/resource/jsonservice?data={"appCode":"EIDM","method":"getSearchProductInfo","pdname":"${barcode}","isdraft":"N","nonpubind":"1","langid":"zh_TW"}`,
  //         );
  //         const responseData = await response.json();

  //         console.log('Getting data OK: \n', responseData);

  //         // Extract data from the response
  //         const pdid = responseData.result[0].data[0].pdid;
  //         const pdname = responseData.result[0].data[0].pdname;

  //         // Update state with the new weather data
  //         setProductInfo({pdid, pdname});
  //       },
  //       error => console.log('Getting data Error: \n', error),
  //   } catch (error) {
  //     console.warn('Error:\n', error);
  //   }
  // }

  async function fetchData(barcode) {
    // const barcode = await scannedBarcode.rawValue;

    // Fetch product data
    try {
      const response = await fetch(
        `https://www.barcodeplus.com.hk/eid/resource/jsonservice?data={"appCode":"EIDM","method":"getSearchProductInfo","pdname":"${barcode}","isdraft":"N","nonpubind":"1","langid":"zh_TW"}`,
      );
      const responseData = await response.json();
      const responseData2 = responseData.result[0];

      console.log(
        'Response url:',
        response,
        '\nGetting data OK: \n',
        responseData2.data[0].pdid,
        '\nGetting data OK: \n',
        responseData2.data[0].pdname,
      );

      // Extract data from the response
      const pdid = responseData2.data[0].pdid;
      const pdname = responseData2.data[0].pdname;

      // Update state with the new product data
      setProductInfo({pdid, pdname});
    } catch (error) {
      console.log('Error: \n', error);
      Alert.alert('找不到商品', '', [
        {
          text: '返回',
          onPress: () => {
            setIsScanned(false);
            navigation.navigate('VIVisualSuppPage');
          },
          style: 'cancel',
        },
      ]);
      return;
    }
  }

  console.log(`Camera permission status: ${cameraPermission}`);

  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.ALL_FORMATS, // You can only specify a particular format
  ]);

  useEffect(() => {
    toggleActiveState();
    return () => {
      barcodes;
    };
  }, [barcodes]);

  const toggleActiveState = async () => {
    if (barcodes && barcodes.length > 0 && isScanned == false) {
      setIsScanned(true);
      // setBarcode('');
      barcodes.forEach(async (scannedBarcode: any) => {
        if (scannedBarcode.rawValue != '') {
          setBarcode(scannedBarcode.rawValue);
          console.log('Barcode: ', scannedBarcode.rawValue);
          // alert(scannedBarcode.rawValue);
          // Popup.show({
          //   type: 'Success',
          //   title: '條碼已掃描',
          //   button: true,
          //   textBody: scannedBarcode.rawValue,
          //   buttonText: '關閉',
          //   buttonText2: 'Details',
          //   callback: () => {
          //     setIsScanned(false);
          //     Popup.hide();
          //   },
          // });
          fetchData(scannedBarcode.rawValue);
          console.log('Name: ', productInfo.pdname);
          if (productInfo.pdname == undefined) {
            console.log(productInfo.pdname);
            setIsScanned(false);
          } else {
            Alert.alert(
              '條碼已掃描',
              `產品名稱：${productInfo.pdname}\n需要查看更多產品資訊嗎？`,
              [
                {
                  text: '是',
                  onPress: () => {
                    setIsScanned(true);
                    console.log('Yes Pressed');
                    navigation.navigate('VIProductInfoBarcode', {
                      pdid: productInfo.pdid,
                    });
                    setIsScanned(false);
                    setProductInfo('');
                  },
                },
                {
                  text: '否',
                  onPress: () => {
                    setIsScanned(false);
                    navigation.goBack();
                  },
                  style: 'cancel',
                },
              ],
            );
          }
        }
      });
    }
  };

  if (cameraDevice && cameraPermission === 'authorized') {
    return (
      <View style={{flex: 1}}>
        <Camera
          style={styles.camera}
          style={StyleSheet.absoluteFill}
          device={cameraDevice}
          isActive={!isScanned}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
      </View>
    );
  }
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
  rnholeView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VIBarcodeScannerPage;
