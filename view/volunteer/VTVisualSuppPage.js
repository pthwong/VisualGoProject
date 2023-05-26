import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

function VTVisualSuppPage() {
  const navigation = useNavigation();

  barcodeScannerProductPress = () => {
    navigation.navigate('VTBarcodeScannerPage');
  };
  barcodeScannerNutritionPress = () => {
    navigation.navigate('VTBarcodeScannerNutritionPage');
  };

  return (
    <View>
      <Text style={styles.titleChi}>視覺支援頁面</Text>

      <TouchableOpacity
        style={styles.barcodeBtn}
        onPress={this.barcodeScannerProductPress}>
        <Text style={styles.btnTxt}>加入/更新超市產品資訊</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.barcodeBtn}
        onPress={this.barcodeScannerNutritionPress}>
        <Text style={styles.btnTxt}>加入/更新超市產品營養資訊</Text>
      </TouchableOpacity>
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
  },
  barcodeBtn: {
    backgroundColor: '#ffd63f',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '3%',
    marginTop: '10%',
    borderRadius: 50,
  },
  btnTxt: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    shadowOpacity: 0.2,
  },
});

export default VTVisualSuppPage;
