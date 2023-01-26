import {React, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

function VILoginPage() {
  //   const [email, onChangeText] = useState('');
  //   const [password, onChangeText] = useState('');
  // const loginBtnHolder = true;

  var emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*$/;

  const [loginBtnHolder, setLoginBtnHolder] = useState(false);

  const [email, setEmail] = useState('');

  // let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const [password, setPassword] = useState('');

  const [shownPasswordHolder, setShownPasswordHolder] = useState(true);

  const navigation = useNavigation();

  // this.state = {
  //   loginBtnHolder: true,
  // };

  // enableLoginBtn = () => {
  //   this.setState({
  //     loginBtnHolder: false,
  //   });
  // };

  // validateEmail = email => {
  //   let format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  //   if (format.test(email) === false) {
  //     console.log('Email is Not Correct');
  //     this.setState({email: email});
  //     return false;
  //   } else {
  //     this.setState({email: email});
  //     console.log('Email is Correct');
  //   }
  // };

  // // if (!email.trim() || !password.trim() || !emailFormat.test(email)) {
  // if (!email.trim() || !password.trim()) {
  //   alert('Empty email & password.');
  //   // useEffect(() => {
  //   //   console.log('Empty email & password.');
  //   //   setLoginBtnHolder(loginBtnHolder);
  //   // }, []);
  // } else {
  //   // useEffect(() => {
  //   //   console.log('Completed');
  //   //   setLoginBtnHolder(!loginBtnHolder);
  //   // }, []);
  // }

  viLoginPress = () => {
    if (!email.trim() && !password.trim()) {
      alert('請輸入電郵地址和密碼\nPlease enter your address and password');
    } else if (!email.trim()) {
      alert('請輸入電郵地址\nPlease enter your address');
    } else if (!email.match(emailRegex)) {
      alert(
        '電郵地址格式錯誤，請重新輸入\nInvalid format of email address, please type again.',
      );
    } else if (!password.trim()) {
      alert('請輸入密碼\nPlease enter your password');
    } else {
      setEmail('');
      setPassword('');
      navigation.navigate('VIPages');
    }
  };

  regPress = () => {
    navigation.navigate('VIRegPage');
  };

  return (
    <View>
      <Text style={styles.titleChi}>視障人士登入</Text>
      <Text style={styles.titleEng}>Login for Visually Impaired</Text>

      <View style={styles.inputField}>
        <Text style={styles.textField}>電郵地址 Email Address</Text>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 10,
          }}>
          <TextInput
            placeholder={'輸入電郵地址 Enter your email address'}
            style={{flex: 1, paddingVertical: 0, fontSize: 18}}
            onChangeText={email => setEmail(email)}
            value={email}
            keyboardType="email-address"
          />
        </View>

        <Text style={styles.inputErr}>
          請輸入電郵地址 Enter your email address
        </Text>

        <Text style={styles.textField}>密碼 Password</Text>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 10,
          }}>
          <TextInput
            placeholder={'輸入密碼 Enter your password'}
            style={{flex: 1, paddingVertical: 0, fontSize: 18}}
            secureTextEntry={true}
            onChangeText={password => setPassword(password)}
            value={password}
          />
        </View>

        <Text style={styles.inputErr}>請輸入密碼 Enter your password</Text>

        <TouchableOpacity
          style={[
            styles.loginBtn,
            {
              backgroundColor: loginBtnHolder ? 'grey' : '#97F9F9',
              opacity: loginBtnHolder ? 0.5 : 1,
            },
          ]}
          disabled={loginBtnHolder}
          onPress={this.viLoginPress}>
          <Text style={styles.btnTxt}>登入 Login</Text>
        </TouchableOpacity>

        <View
          style={{
            borderBottomColor: 'grey',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: '10%',
          }}
        />

        <TouchableOpacity style={styles.regBtn} onPress={this.regPress}>
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
    marginTop: '20%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  loginBtn: {
    // backgroundColor: loginBtnHolder ? 'grey' : '#97F9F9',
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
  inputErr: {
    fontSize: 13,
    color: 'red',
    marginBottom: '5%',
  },
  btnTxt: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    shadowOpacity: 0.2,
  },
});

export default VILoginPage;
