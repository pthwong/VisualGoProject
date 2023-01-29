import {React, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  TouchableOpacityComponent,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';

function VTRegPage() {
  var emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const [email, setEmail] = useState('');
  const [isEnterEmail, setEnterEmail] = useState(true);
  const [isValidEmail, setValidEmail] = useState(true);

  const [password, setPassword] = useState('');
  const [isEnterPassword, setEnterPassword] = useState(true);

  const [notShownPasswordHolder, setNotShownPasswordHolder] = useState(true);

  const navigation = useNavigation();

  const verifyEnterEmail = email => {
    if (true) return true;
    return false;
  };

  const verifyValidEmail = email => {
    if (true) return true;
    return false;
  };

  const verifyPassword = password => {
    if (true) return true;
    return false;
  };

  const showPassword = notShownPasswordHolder => {
    if (true) return true;
    return false;
  };

  // viLoginPress = () => {
  //   if (!email.trim() && !password.trim()) {
  //     alert('請輸入電郵地址和密碼\nPlease enter your address and password');
  //     setEnterEmail(false);
  //     setValidEmail(true);
  //   } else if (!email.trim()) {
  //     alert('請輸入電郵地址\nPlease enter your address');
  //     setEnterEmail(false);
  //     setValidEmail(true);
  //   } else if (!email.match(emailRegex)) {
  //     alert(
  //       '電郵地址格式錯誤，請重新輸入\nInvalid format of email address, please type again.',
  //     );
  //     setValidEmail(false);
  //   } else if (!password.trim()) {
  //     alert('請輸入密碼\nPlease enter your password');
  //   } else {
  //     setEmail('');
  //     setPassword('');
  //     navigation.navigate('VIPages');
  //   }
  // };

  viLoginPress = () => {
    if (!email.trim() && !password.trim() && !email.match(emailRegex)) {
      setEnterEmail(false);
      setValidEmail(true);
      setEnterPassword(false);
    } else if (!email.trim()) {
      // alert('請輸入電郵地址\nPlease enter your address');
      setEnterEmail(false);
      setValidEmail(true);
    } else if (!email.match(emailRegex)) {
      // alert(
      //   '電郵地址格式錯誤，請重新輸入\nInvalid format of email address, please type again.',
      // );
      setValidEmail(false);
    } else if (!password.trim()) {
      setEnterPassword(false);
    } else {
      setEmail('');
      setPassword('');
      navigation.navigate('VTPages');
    }
  };

  clearEmail = () => {
    setEmail('');
  };

  clearPassword = () => {
    setPassword('');
  };

  showPasswordPress = () => {
    setNotShownPasswordHolder(false);
  };
  hidePasswordPress = () => {
    setNotShownPasswordHolder(true);
  };

  regPress = () => {
    setEmail('');
    setPassword('');
    setEnterPassword(true);
    setEnterEmail(true);
    setValidEmail(true);
    navigation.navigate('VTRegPage');
  };

  return (
    <ScrollView>
      <Text style={styles.titleChi}>義工登入</Text>
      <Text style={styles.titleEng}>Login for Volunteer</Text>

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
            onChangeText={email => {
              setEmail(email);
              const isEntered = verifyEnterEmail(email);
              isEntered ? setEnterEmail(true) : setEnterEmail(false);
              const isValid = verifyValidEmail(email);
              isValid ? setValidEmail(true) : setValidEmail(false);
            }}
            value={email}
            keyboardType="email-address"
          />
          <TouchableOpacity
            onPress={this.clearEmail}
            accessible={true}
            accessibilityLabel={'清除電郵地址 Clear the email address'}>
            <Ionicons name={'close-sharp'} size={25} />
          </TouchableOpacity>
        </View>

        <Text style={styles.inputErr}>
          {isEnterEmail ? '' : '請輸入電郵地址 Enter your email address'}
          {isValidEmail
            ? ''
            : '電郵地址格式錯誤 Invalid format of email address'}
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
            // secureTextEntry={true}
            secureTextEntry={notShownPasswordHolder}
            onChangeText={password => {
              setPassword(password);
              const isEntered = verifyPassword(password);
              isEntered ? setEnterPassword(true) : setEnterPassword(false);
            }}
            value={password}
          />
          <TouchableOpacity
            onPress={this.clearPassword}
            accessible={true}
            accessibilityLabel={'清除密碼 Clear the password'}>
            <Ionicons name={'close-sharp'} size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={
              notShownPasswordHolder
                ? '點選以展示密碼 Tap to show password'
                : '點選以隱藏密碼 Tap to hide password'
            }
            onPress={
              !notShownPasswordHolder
                ? this.hidePasswordPress
                : this.showPasswordPress
            }>
            <Ionicons
              name={notShownPasswordHolder ? 'eye' : 'eye-off-outline'}
              size={25}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.inputErr}>
          {isEnterPassword ? '' : '請輸入密碼 Enter your password'}
        </Text>

        <TouchableOpacity
          style={[
            styles.loginBtn,
            {
              backgroundColor: '#ADECC1',
              opacity: 1,
            },
          ]}
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
    </ScrollView>
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
  loginBtn: {
    // backgroundColor: loginBtnHolder ? 'grey' : '#97F9F9',
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
});

export default VTRegPage;
