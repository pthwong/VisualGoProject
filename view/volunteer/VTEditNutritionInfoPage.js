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
  BackHandler,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message-large';

function VTEditNutritionInfoPage({route}) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // const {pdid: pdid} = route.params;
  const {barcode: productBarcode} = route.params;

  leaveEditPress = () => {
    Alert.alert(
      '確定取消更新營養資訊？',
      '取消後需要重新更新營養資訊',
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
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => leaveEditPress()}
          style={{marginLeft: 5}}>
          <Ionicons name="close-outline" size={40} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() => editNutritionInfo()}
            style={{marginLeft: 5}}>
            <Text style={{fontSize: 18}}>保存</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = () => {
    leaveEditPress();
    return true;
  };

  //2. Nurition Information
  const [ingredients, setIngredients] = useState(null);
  const [servings, setServings] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [energy_kcal, setEnergy_kcal] = useState(null);
  const [fat, setFat] = useState(null);
  const [saturated_fat, setSaturated_fat] = useState(null);
  const [trans_fat, setTrans_fat] = useState(null);
  const [cholesterol, setCholesterol] = useState(null);
  const [carbohydrates, setCarbohydrates] = useState(null);
  const [sugars, setSugars] = useState(null);
  const [fiber, setFiber] = useState(null);
  const [proteins, setProteins] = useState(null);
  const [sodium, setSodium] = useState(null);
  const [vitamin_a, setVitamin_a] = useState(null);
  const [vitamin_c, setVitamin_c] = useState(null);
  const [calcium, setCalcium] = useState(null);
  const [iron, setIron] = useState(null);

  // others
  const [vtEmail, setVtEmail] = useState('');

  const fetchDataFromDB = useCallback(async barcode => {
    try {
      const response = await fetch(
        `https://api.whomethser.synology.me:3560/visualgo/v1/getNutritionInfoByBarcode/${barcode}`,
      );
      const responseData = await response.json();
      console.log('DB data: ', responseData);
      return responseData.response;
    } catch (error) {
      console.log('Error: \n', error);
      return null;
    }
  }, []);

  useEffect(() => {
    getProductInfo();
  }, [getProductInfo]);

  const getProductInfo = useCallback(async () => {
    setLoading(true);
    // const productName = await fetchNameFromDB(productBarcode);
    const dbProduct = await fetchDataFromDB(productBarcode);

    if (!dbProduct.productBarcode || !productBarcode) {
      alert('no data fetched');
      navigation.navigate('VTVisualSuppPage');
    } else {
      // fetch data from Database
      setIngredients(dbProduct.ingredients);
      setServings(dbProduct.servings);
      setEnergy(dbProduct.energy);
      setEnergy_kcal(dbProduct.energy_kcal);
      setFat(dbProduct.fat);
      setSaturated_fat(dbProduct.saturated_fat);
      setTrans_fat(dbProduct.trans_fat);
      setCholesterol(dbProduct.cholesterol);
      setCarbohydrates(dbProduct.carbohydrates);
      setSugars(dbProduct.sugars);
      setFiber(dbProduct.fiber);
      setProteins(dbProduct.proteins);
      setSodium(dbProduct.sodium);
      setVitamin_a(dbProduct.vitamin_a);
      setVitamin_c(dbProduct.vitamin_c);
      setCalcium(dbProduct.calcium);
      setIron(dbProduct.iron);
    }
    setLoading(false);
  }, [fetchDataFromDB, navigation, productBarcode]);

  editNutritionInfo = async () => {
    console.log(
      'Result: \n',
      ingredients,
      servings,
      energy,
      energy_kcal,
      fat,
      saturated_fat,
      trans_fat,
      cholesterol,
      carbohydrates,
      sugars,
      fiber,
      proteins,
      sodium,
      vitamin_a,
      vitamin_c,
      calcium,
      iron,
    );

    try {
      const response = await fetch(
        `https://api.whomethser.synology.me:3560/visualgo/v1/updateNutritionInfo/${productBarcode}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredients,
            servings,
            energy,
            energy_kcal,
            fat,
            saturated_fat,
            trans_fat,
            cholesterol,
            carbohydrates,
            sugars,
            fiber,
            proteins,
            sodium,
            vitamin_a,
            vitamin_c,
            calcium,
            iron,
          }),
        },
      );
      if (response.status === 201) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: '營養資訊已更新',
          text2: '',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 100,
        });
        console.log('Nutrition info updated successfully:\n', response.data);
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
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 200}}>
          <View style={styles.container}>
            <View style={styles.leftContainer}>
              <Text style={{fontSize: 20}}>條碼:</Text>
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
              <Text style={{fontSize: 20}}>份量:</Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入份量"
                value={servings}
                onChangeText={servings => {
                  setServings(servings);
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
              <Text style={{fontSize: 20}}>材料:</Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入材料"
                value={ingredients}
                onChangeText={ingredients => {
                  setIngredients(ingredients);
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
              <Text style={{fontSize: 20}}>能量: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入能量"
                value={energy}
                onChangeText={energy => {
                  setEnergy(energy);
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
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}
          <View style={styles.container}>
            <View style={styles.leftContainer}>
              <Text style={{fontSize: 20}}>能量(千卡): </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入能量(千卡)"
                value={energy_kcal}
                onChangeText={energy_kcal => {
                  setEnergy_kcal(energy_kcal);
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
              <Text style={{fontSize: 20}}>脂肪: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入脂肪份量"
                value={fat}
                onChangeText={fat => {
                  setFat(fat);
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
              <Text style={{fontSize: 20}}>飽和脂肪: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入飽和脂肪份量"
                value={saturated_fat}
                onChangeText={saturated_fat => {
                  setSaturated_fat(saturated_fat);
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
              <Text style={{fontSize: 20}}>反式脂肪: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入反式脂肪份量"
                value={trans_fat}
                onChangeText={trans_fat => {
                  setTrans_fat(trans_fat);
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
              <Text style={{fontSize: 20}}>膽固醇: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入膽固醇份量"
                value={cholesterol}
                onChangeText={cholesterol => {
                  setCholesterol(cholesterol);
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
              <Text style={{fontSize: 20}}>碳水化合物: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入碳水化合物份量"
                value={carbohydrates}
                onChangeText={carbohydrates => {
                  setCarbohydrates(carbohydrates);
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
              <Text style={{fontSize: 20}}>糖份: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入糖份份量"
                value={sugars}
                onChangeText={sugars => {
                  setSugars(sugars);
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
              <Text style={{fontSize: 20}}>纖維: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入纖維"
                value={fiber}
                onChangeText={fiber => {
                  setFiber(fiber);
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
              <Text style={{fontSize: 20}}>蛋白質: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="蛋白質"
                value={proteins}
                onChangeText={proteins => {
                  setProteins(proteins);
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
              <Text style={{fontSize: 20}}>鈉: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入鈉份量"
                value={sodium}
                onChangeText={sodium => {
                  setSodium(sodium);
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
              <Text style={{fontSize: 20}}>維他命A: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入維他命A份量"
                value={vitamin_a}
                onChangeText={vitamin_a => {
                  setVitamin_a(vitamin_a);
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
              <Text style={{fontSize: 20}}>維他命C: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入維他命C份量"
                value={vitamin_c}
                onChangeText={vitamin_c => {
                  setVitamin_c(vitamin_c);
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
              <Text style={{fontSize: 20}}>鈣: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入鈣份量"
                value={calcium}
                onChangeText={calcium => {
                  setCalcium(calcium);
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
              <Text style={{fontSize: 20}}>鐵: </Text>
            </View>
            <View style={styles.rightContainer}>
              <TextInput
                style={styles.input}
                placeholder="輸入鐵份量"
                value={iron}
                onChangeText={iron => {
                  setIron(iron);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default VTEditNutritionInfoPage;

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
    fontSize: 40,
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
