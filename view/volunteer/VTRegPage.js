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

function VTRegPage() {
  //   const [email, onChangeText] = useState('');
  //   const [password, onChangeText] = useState('');

  return (
    <View>
      <Text style={styles.titleChi}>義工註冊</Text>
      <Text style={styles.titleEng}>Registeration for Volunteers</Text>

      <View style={styles.inputField}>
        <Text style={styles.textField}>電郵地址 Email Address</Text>
        <InputField
          label={'輸入電郵地址 Enter your email address'}
          keyboardType="email-address"
        />
        <Text style={styles.textField}>姓名 Name</Text>
        <InputField label={'輸入姓名 Enter your name'} />
        <Text style={styles.textField}>密碼 Password</Text>
        <InputField
          label={'輸入密碼 Enter your Password'}
          inputType="password"
        />
        <Text style={styles.textField}>
          請再次輸入密碼 Enter Password again
        </Text>
        <InputField
          label={'請再次輸入密碼 Enter Password again'}
          inputType="password"
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
  regBtn: {
    backgroundColor: '#ADECC1',
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

export default VTRegPage;
