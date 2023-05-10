import {React, useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  TouchableOpacityComponent,
  Platform,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message-large';

function VTAddProductInfoPage({route}) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {pdid: pdid} = route.params;
  const {barcode: productBarcode} = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              '確定取消建立產品資訊？',
              '取消後需要重新建立產品資訊',
              [
                {
                  text: '取消',
                  onPress: () => console.log('Cancel Pressed'),
                },
                {
                  text: '確定',
                  onPress: () => {
                    navigation.navigate('VTVisualSuppPage');
                  },
                  style: 'destructive',
                },
              ],
              {cancelable: false},
            );
          }}
          style={{marginLeft: 5}}>
          <Ionicons name="close-outline" size={40} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() => addProductInfo()}
            style={{marginLeft: 5}}>
            <Text style={{fontSize: 18}}>保存</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  //1. Basic Product Information
  const [productBrand, setProductBrand] = useState(null);
  const [productName, setProductName] = useState(null);
  const [productDesc, setProductDesc] = useState(null);
  const [productCountry, setProductCountry] = useState(null);
  const [productUnit, setProductUnit] = useState(null);
  const [tagName, setTagName] = useState(null);

  // others
  const [vtEmail, setVtEmail] = useState('');

  const fetchDataFromDB = useCallback(async barcode => {
    try {
      const response = await fetch(
        `https://api.whomethser.synology.me:3560/visualgo/v1/getProductInfoByBarcode/${barcode}`,
      );
      const responseData = await response.json();
      console.log('DB data: ', responseData);
      return responseData.response || {};
    } catch (error) {
      console.log('Error: \n', error);
      return {};
    }
  }, []);

  const fetchDataFromBarcodePlus = useCallback(async pdid => {
    try {
      const response = await fetch(
        `https://www.barcodeplus.com.hk/eid/resource/jsonservice?data={"appCode":"EIDM","method":"getProductDetailsById","pdid":"${pdid}","langid":"zh_TW"}`,
      );
      const responseData = await response.json();
      const responseData2 = responseData.result[0];
      return responseData2.data[0] || {};
    } catch (error) {
      console.log('Error: \n', error);
      return {};
    }
  }, []);

  useEffect(() => {
    getEmail();
  }, []);

  const getEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('vtEmail');
      setVtEmail(email);
    } catch (error) {
      console.error('Error getting email:\n', error);
    }
  };

  useEffect(() => {
    getProductInfo();
  }, [getProductInfo]);

  const getProductInfo = useCallback(async () => {
    setLoading(true);
    const dbProduct = await fetchDataFromDB(productBarcode);
    const barcodePlusProduct = await fetchDataFromBarcodePlus(pdid);

    if (!dbProduct.productBarcode || !productBarcode) {
      //1. If data not found from database, fetch data from Barcode Plus
      setProductBrand(barcodePlusProduct.pdbrndname);
      setProductName(barcodePlusProduct.pdname);
      setProductDesc(barcodePlusProduct.pddesc);
      setProductCountry(barcodePlusProduct.pdcntyoforgn);
      setProductUnit(barcodePlusProduct.pdgroswgt, barcodePlusProduct.pdwgtuom);
      setTagName('');
    } else {
      //2. Otherwise, fetch data from Database
      setProductBrand(dbProduct.productBrand);
      setProductName(dbProduct.productName);
      setProductDesc(dbProduct.productDesc);
      setProductCountry(dbProduct.productCountry);
      setProductUnit(dbProduct.productUnit);
      setTagName(dbProduct.tagName);
    }
    setLoading(false);
  }, [
    fetchDataFromDB,
    fetchDataFromBarcodePlus,
    navigation,
    pdid,
    productBarcode,
  ]);

  addProductInfo = async () => {
    console.log('Result: \n');
    if (!productName) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '請填上產品名稱',
        text2: '',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 100,
      });
    } else {
      setLoading(true);
      try {
        const response = await fetch(
          'https://api.whomethser.synology.me:3560/visualgo/v1/addProductInfo',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productBarcode,
              productBrand,
              productName,
              productCountry,
              productUnit,
              tagName,
              productDesc,
            }),
          },
        );
        if (response.status === 201) {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: '產品資訊已建立',
            text2: '',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 100,
          });
          console.log('Product info created successfully:\n', response.data);
          navigation.navigate('VTVisualSuppPage');
        } else {
          console.error('Error 1:\n', response.status, '\nResponse:', response);
          if (!response.ok) {
            const errorBody = await response.json();
            console.log('Error response body:', errorBody);
          }
        }
      } catch (error) {
        console.error('Error 2:\n', error);
      }
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.leftContainer}></View>
        <View style={styles.rightContainerTitle}>
          <TextInput
            style={styles.inputTitle}
            placeholder="輸入物品名稱"
            value={productName}
            onChangeText={productName => setProductName(productName)}
            multiline={true}
            numberOfLines={2}
          />
        </View>
      </View>

      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: '10%',
        }}
      />
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text style={{fontSize: 20}}>Barcode:</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={(styles.input, {color: 'grey', fontSize: 20})}>
            {productBarcode}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: '10%',
        }}
      />
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text style={{fontSize: 20}}>品牌名稱：</Text>
        </View>
        <View style={styles.rightContainer}>
          <TextInput
            style={styles.input}
            placeholder="輸入名稱"
            value={productBrand}
            onChangeText={productBrand => {
              setProductBrand(productBrand);
            }}
          />
        </View>
      </View>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: '10%',
        }}
      />
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text style={{fontSize: 20}}>來源地： </Text>
        </View>
        <View style={styles.rightContainer}>
          <TextInput
            style={styles.input}
            placeholder="輸入名稱"
            value={productCountry}
            onChangeText={productCountry => {
              setProductCountry(productCountry);
            }}
          />
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
      </View>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: '10%',
        }}
      />
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text style={{fontSize: 20}}>重量： </Text>
        </View>
        <View style={styles.rightContainer}>
          <TextInput
            style={styles.input}
            placeholder="輸入名稱"
            value={productDesc}
            onChangeText={productUnit => {
              setProductUnit(productUnit);
            }}
          />
        </View>
      </View>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: '10%',
        }}
      />
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text style={{fontSize: 20}}>標籤： </Text>
        </View>
        <View style={styles.rightContainer}>
          <TextInput
            style={styles.input}
            placeholder="輸入名稱"
            value={tagName}
            onChangeText={tagName => {
              setTagName(tagName);
            }}
          />
        </View>
      </View>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: '10%',
        }}
      />

      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Ionicons name={'document-text-outline'} size={30} />
        </View>
        <View style={styles.rightContainer}>
          <TextInput
            style={styles.input}
            placeholder="輸入內容"
            multiline={true}
            numberOfLines={4}
            value={productDesc}
            onChangeText={productDesc => {
              setProductDesc(productDesc);
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default VTAddProductInfoPage;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  leftContainer: {
    marginLeft: 5,
  },
  leftArrowContainer: {flexGrow: 1},
  rightContainerTitle: {
    flexGrow: 1,
    marginLeft: 8,
    marginTop: 10,
  },
  rightContainer: {
    flexGrow: 1,
    marginLeft: 15,
  },
  rightArrowContainer: {
    flexGrow: 1,
  },
  rightTimeContainer: {
    textAlign: 'right',
    paddingRight: 30,
  },
  input: {
    borderColor: 'gray',
    padding: 10,
    fontSize: 20,
  },
  inputTitle: {
    fontSize: 30,
  },
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
    marginTop: '10%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  inputDescribeField: {
    border: 1,
    fontSize: 25,
    marginTop: '2%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  loginBtn: {
    backgroundColor: '#ADECC1',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '4%',
    marginTop: '10%',
    borderRadius: 50,
    // shadowOpacity: 0.1,
  },
  regBtn: {
    backgroundColor: '#ffd63f',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '4%',
    marginTop: '10%',
    borderRadius: 50,
    // shadowOpacity: 0.1,
  },
  inputErr: {
    fontSize: 16,
    color: 'red',
    marginBottom: '5%',
  },
  btnTxt: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    shadowOpacity: 0.2,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: Platform.OS === 'ios' ? 4 : 8,
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 50,
    width: '100%',
  },
  selectedDistrict: {
    marginTop: 20,
    fontSize: 18,
  },
});
