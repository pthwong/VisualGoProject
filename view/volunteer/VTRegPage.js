import {React, useState, useEffect, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  TouchableOpacityComponent,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';

function VIRegPage() {
  var emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  var passwordRegex = /^.{8,32}$/;

  const [email, setEmail] = useState('');
  const [isEnterEmail, setEnterEmail] = useState(true);
  const [isValidEmail, setValidEmail] = useState(true);

  const [name, setName] = useState('');
  const [isEnterName, setEnterName] = useState(true);

  const [firstPassword, setFirstPassword] = useState('');
  const [isEnterFirstPassword, setEnterFirstPassword] = useState(true);
  const [notShownFirstPasswordHolder, setNotShownFirstPasswordHolder] =
    useState(true);

  const [secondPassword, setSecondPassword] = useState('');
  const [isEnterSecondPassword, setEnterSecondPassword] = useState(true);
  const [notShownSecondPasswordHolder, setNotShownSecondPasswordHolder] =
    useState(true);

  const [isValidPassword, setValidPassword] = useState(true);

  const [isMatchPassword, setMatchPassword] = useState(true);

  const navigation = useNavigation();

  const [regSuccess, setRegSuccess] = useState(false);

  leaveEditPress = () => {
    Alert.alert(
      '確定離開註冊程序？',
      '取消後需要重新輸入資料',
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: '確定',
          onPress: () => {
            navigation.goBack();
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
          onPress={() => {
            leaveEditPress();
          }}
          style={{marginLeft: 4}}>
          <Ionicons name="chevron-back-outline" size={40} color="black" />
        </TouchableOpacity>
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

  const verifyEnterEmail = email => {
    if (true) return true;
    return false;
  };

  const verifyValidEmail = email => {
    if (true) return true;
    return false;
  };

  const verifyEnterName = name => {
    if (true) return true;
    return false;
  };

  const verifyFirstPassword = firstPassword => {
    if (true) return true;
    return false;
  };

  const verifyValidPassword = firstPassword => {
    if (true) return true;
    return false;
  };

  const verifySecondPassword = secondPassword => {
    if (true) return true;
    return false;
  };

  const verifyMatchPassword = secondPassword => {
    if (true) return true;
    return false;
  };

  viRegPress = () => {
    if (
      !email.trim() &&
      !email.match(emailRegex) &&
      !name.trim() &&
      !firstPassword.trim() &&
      !firstPassword.match(passwordRegex) &&
      !secondPassword.trim()
    ) {
      setEnterEmail(false);
      setValidEmail(true);
      setEnterName(false);
      setEnterFirstPassword(false);
      setEnterSecondPassword(false);
      setMatchPassword(false);
    } else if (!email.trim()) {
      // alert('請輸入電郵地址\nPlease enter your address');
      setEnterEmail(false);
      setValidEmail(true);
    } else if (!email.match(emailRegex)) {
      // alert(
      //   '電郵地址格式錯誤，請重新輸入\nInvalid format of email address, please type again.',
      // );
      setValidEmail(false);
    } else if (!firstPassword.trim()) {
      setEnterFirstPassword(false);
      setValidPassword(true);
      setMatchPassword(false);
    } else if (!firstPassword.match(passwordRegex)) {
      setEnterFirstPassword(true);
      setValidPassword(false);
      setMatchPassword(false);
    } else if (!secondPassword.trim()) {
      setMatchPassword(true);
      setEnterSecondPassword(false);
    } else if (secondPassword != firstPassword) {
      setMatchPassword(false);
    } else {
      setEmail('');
      setName('');
      setFirstPassword('');
      setSecondPassword('');
      navigation.navigate('VIPages');
    }
  };
  if (regSuccess) {
    setEmail('');
    setName('');
    setFirstPassword('');
    setSecondPassword('');
    navigation.navigate('VIPages');
  }

  showFirstPasswordPress = () => {
    setNotShownFirstPasswordHolder(false);
  };
  hideFirstPasswordPress = () => {
    setNotShownFirstPasswordHolder(true);
  };

  showSecondPasswordPress = () => {
    setNotShownSecondPasswordHolder(false);
  };
  hideSecondPasswordPress = () => {
    setNotShownSecondPasswordHolder(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView>
        <Text style={styles.titleChi}>義工註冊</Text>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                onPress={() => {
                  setEmail('');
                }}
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

            <Text style={styles.textField}>姓名 Name</Text>

            <View
              style={{
                flexDirection: 'row',
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
                paddingBottom: 8,
                marginBottom: 10,
              }}>
              <TextInput
                placeholder={'輸入姓名 Enter your name'}
                style={{flex: 1, paddingVertical: 0, fontSize: 18}}
                onChangeText={name => {
                  setName(name);
                  const isEntered = verifyEnterName(name);
                  isEntered ? setEnterName(true) : setEnterName(false);
                }}
                value={name}
              />
              <TouchableOpacity
                onPress={() => {
                  setName('');
                }}
                accessible={true}
                accessibilityLabel={'清除姓名 Clear the name'}>
                <Ionicons name={'close-sharp'} size={25} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputErr}>
              {isEnterName ? '' : '請輸入姓名 Enter your name'}
            </Text>

            <Text style={styles.textField}>
              密碼 Password (請輸入最少八位數字)
            </Text>

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
                secureTextEntry={notShownFirstPasswordHolder}
                onChangeText={firstPassword => {
                  setFirstPassword(firstPassword);
                  const isEntered = verifyFirstPassword(firstPassword);
                  isEntered
                    ? setEnterFirstPassword(true)
                    : setEnterFirstPassword(false);
                  const isValid = verifyValidPassword(firstPassword);
                  isValid ? setValidPassword(true) : setValidPassword(false);
                }}
                value={firstPassword}
              />
              <TouchableOpacity
                onPress={() => {
                  setFirstPassword('');
                }}
                accessible={true}
                accessibilityLabel={'清除密碼 Clear the password'}>
                <Ionicons name={'close-sharp'} size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={
                  notShownFirstPasswordHolder
                    ? '點選以展示密碼 Tap to show password'
                    : '點選以隱藏密碼 Tap to hide password'
                }
                onPress={
                  !notShownFirstPasswordHolder
                    ? this.hideFirstPasswordPress
                    : this.showFirstPasswordPress
                }>
                <Ionicons
                  name={notShownFirstPasswordHolder ? 'eye' : 'eye-off-outline'}
                  size={25}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputErr}>
              {isEnterFirstPassword ? '' : '請輸入密碼 Enter your password'}
              {isValidPassword
                ? ''
                : '請輸入最少8位密碼 Enter at least eight characters'}
            </Text>

            <Text style={styles.textField}>
              請再次輸入密碼 Enter Password again
            </Text>

            <View
              style={{
                flexDirection: 'row',
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
                paddingBottom: 8,
                marginBottom: 10,
                flex: 1,
              }}>
              <TextInput
                placeholder={'請再次輸入密碼 Enter your password again'}
                style={{flex: 1, paddingVertical: 0, fontSize: 18}}
                // secureTextEntry={true}
                secureTextEntry={notShownSecondPasswordHolder}
                onChangeText={secondPassword => {
                  setSecondPassword(secondPassword);
                  const isEntered = verifySecondPassword(secondPassword);
                  isEntered
                    ? setEnterSecondPassword(true)
                    : setEnterSecondPassword(false);
                  const isMatched = verifyMatchPassword(secondPassword);
                  isMatched ? setMatchPassword(true) : setMatchPassword(false);
                }}
                value={secondPassword}
              />
              <TouchableOpacity
                onPress={() => {
                  setSecondPassword('');
                }}
                accessible={true}
                accessibilityLabel={'清除密碼 Clear the password'}>
                <Ionicons name={'close-sharp'} size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={
                  notShownSecondPasswordHolder
                    ? '點選以展示密碼 Tap to show password'
                    : '點選以隱藏密碼 Tap to hide password'
                }
                onPress={
                  !notShownSecondPasswordHolder
                    ? this.hideSecondPasswordPress
                    : this.showSecondPasswordPress
                }>
                <Ionicons
                  name={
                    notShownSecondPasswordHolder ? 'eye' : 'eye-off-outline'
                  }
                  size={25}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputErr}>
              {isMatchPassword ? '' : '密碼不相符 Password does not match'}
            </Text>

            <TouchableOpacity style={styles.regBtn} onPress={this.viRegPress}>
              <Text style={styles.btnTxt}>註冊帳戶 Register</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  titleChi: {
    marginTop: '5%',
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
    backgroundColor: '#97F9F9',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '4%',
    marginTop: '10%',
    borderRadius: 50,
    // shadowOpacity: 0.1,
    marginBottom: '10%',
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

export default VIRegPage;
