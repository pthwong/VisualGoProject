import React from 'react';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import InputField from '../../components/InputField';

function VILoginPage() {
  //   const [email, onChangeText] = useState('');
  //   const [password, onChangeText] = useState('');

  return (
    <View>
      <Text style={styles.titleChi}>視障人士登入</Text>
      <Text style={styles.titleEng}>Login for Visually Impaired</Text>

      <View style={styles.inputField}>
        <Text style={styles.textField}>電郵地址 Email Address</Text>
        <InputField
          label={'輸入電郵地址 Enter your email address'}
          keyboardType="email-address"
        />
        <Text style={styles.textField}>密碼 Password</Text>
        <InputField
          label={'輸入密碼 Enter your Password'}
          inputType="password"
        />

        <TouchableOpacity style={styles.loginBtn} onPress={this.viPress}>
          <Text style={styles.btnTxt}>登入 Login</Text>
        </TouchableOpacity>

        <View
          style={{
            borderBottomColor: 'grey',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: '10%',
          }}
        />

        <TouchableOpacity style={styles.regBtn} onPress={this.viPress}>
          <Text style={styles.btnTxt}>註冊帳戶 Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleChi: {
    marginTop: '20%',
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
  regBtn: {
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

export default VILoginPage;
