import React from 'react';
import {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
  ActivityIndicator,
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

function VTBarcodeScannerProductPage() {
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.ALL_FORMATS, // You can only specify a particular format
  ]);

  const [isScanned, setIsScanned] = useState(false);
  const devices = useCameraDevices();
  const cameraDevice = devices.back;

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  const fetchDataFromDB = useCallback(async barcode => {
    try {
      const response = await fetch(
        `https://api.whomethser.synology.me:3560/visualgo/v1/getProductInfoByBarcode/${barcode}`,
      );
      const responseData = await response.json();
      console.log('DB data: ', responseData);
      return responseData;
    } catch (error) {
      console.log('Error: \n', error);
      return null;
    }
  }, []);

  const fetchDataFromBarcodePlus = useCallback(async barcode => {
    try {
      const response = await fetch(
        `https://www.barcodeplus.com.hk/eid/resource/jsonservice?data={"appCode":"EIDM","method":"getSearchProductInfo","pdname":"${barcode}","isdraft":"N","nonpubind":"1","langid":"zh_TW"}`,
      );
      const responseData = await response.json();
      const responseData2 = responseData.result[0];
      return responseData2.data[0];
    } catch (error) {
      console.log('Error: \n', error);
      return null;
    }
  }, []);

  const processBarcode = useCallback(async () => {
    if (barcodes && barcodes.length > 0 && isScanned === false) {
      for (const scannedBarcode of barcodes) {
        if (scannedBarcode.rawValue !== '') {
          setBarcode(scannedBarcode.rawValue);
          console.log('Barcode: ', scannedBarcode.rawValue);
          setIsScanned(true);
          setIsLoading(true);
          const dbProduct = await fetchDataFromDB(scannedBarcode.rawValue);
          if (!dbProduct?.response?.productBarcode) {
            console.log(
              'Product from db has no result here, \n',
              dbProduct?.response?.productBarcode,
            );

            const barcodePlusProduct = await fetchDataFromBarcodePlus(
              scannedBarcode.rawValue,
            );
            if (!barcodePlusProduct?.pdid) {
              Alert.alert(
                '條碼已掃描',
                `沒有此商品的相關資料，請問可以幫忙加入商品資訊嗎？`,
                [
                  {
                    text: '取消',
                    onPress: () => navigation.goBack(),
                    style: 'destructive',
                  },
                  {
                    text: '確定',
                    onPress: () => {
                      navigation.navigate('VTAddProductInfoPage', {
                        pdid: barcodePlusProduct?.pdid,
                        barcode: scannedBarcode.rawValue,
                      });
                    },
                  },
                ],
              );
            } else {
              Alert.alert(
                '條碼已掃描 (Barcode Plus)',
                `產品名稱：${barcodePlusProduct?.pdname}\n需要加入更多此產品的資訊嗎？`,
                [
                  {
                    text: '取消',
                    onPress: () => navigation.goBack(),
                    style: 'destructive',
                  },
                  {
                    text: '確定',
                    onPress: () => {
                      navigation.navigate('VTAddProductInfoPage', {
                        pdid: barcodePlusProduct?.pdid,
                        barcode: scannedBarcode.rawValue,
                      });
                      // navigation.navigate('VTEditProductInfoPage');
                    },
                  },
                ],
              );
            }
          } else {
            Alert.alert(
              '條碼已掃描 (Database)',
              `產品名稱：${dbProduct?.response?.productName}\n需要更新此產品的資訊嗎？`,
              [
                {
                  text: '取消',
                  onPress: () => navigation.goBack(),
                  style: 'destructive',
                },
                {
                  text: '確定',
                  onPress: () => {
                    navigation.navigate('VTEditProductInfoPage', {
                      barcode: scannedBarcode.rawValue,
                    });
                    // navigation.navigate('VTEditProductInfoPage');
                  },
                },
              ],
            );
          }
          setIsLoading(false);
        }
      }
    }
  }, [barcodes, isScanned, fetchDataFromDB, fetchDataFromBarcodePlus]);

  useEffect(() => {
    processBarcode();
  }, [processBarcode]);

  console.log(`Camera permission status: ${cameraPermission}`);

  //   const {width, height} = Dimensions.get('window');
  //   const holeWidth = 300;
  //   const holeHeight = 200;

  if (cameraDevice && cameraPermission === 'authorized') {
    return (
      <View style={{flex: 1}}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={cameraDevice}
          isActive={!isScanned}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        {/* <View
          style={[styles.overlay, {top: 0, bottom: (height + holeHeight) / 2}]}
        />
        <View
          style={[
            styles.overlay,
            {
              top: (height - holeHeight) / 2,
              bottom: 0,
              left: 0,
              right: (width + holeWidth) / 2,
            },
          ]}
        />
        <View
          style={[
            styles.overlay,
            {
              top: (height - holeHeight) / 2,
              bottom: 0,
              left: (width + holeWidth) / 2,
              right: 0,
            },
          ]}
        />
        <View
          style={[styles.overlay, {top: (height + holeHeight) / 2, bottom: 0}]}
        />  */}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
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
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // This will give a slight dark background
    alignItems: 'center', // horizontal center
    justifyContent: 'center', // vertical center
  },
});

export default VTBarcodeScannerProductPage;
