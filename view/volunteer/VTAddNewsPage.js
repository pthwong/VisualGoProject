import {React, useState, useEffect} from 'react';
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
} from 'react-native';
import {useRoute, CommonActions} from '@react-navigation/native';

import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import {axios} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AntDesign} from 'react-native-vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

function VTAddNewsPage() {
  const route = useRoute();

  const navigation = useNavigation();

  const [postTitle, setPostTitle] = useState('');
  const [isEnterPostTitle, setEnterPostTitle] = useState(true);
  const [postDescribe, setPostDescribe] = useState('');
  const [isEnterPostDescribe, setEnterPostDescribe] = useState(true);
  const [postStartDateTime, setPostStartDateTime] = useState('');
  const [postEndDateTime, setPostEndDateTime] = useState('');
  const [postBuilding, setPostBuilding] = useState('');
  const [district, setDistrict] = useState('');
  const [vtEmail, setVtEmail] = useState('');

  clearPostTitle = () => {
    setPostTitle('');
  };

  const enteredPostTitle = postTitle => {
    if (true) return true;
    return false;
  };

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  const showStartDateTimePicker = () => {
    setPickerMode('date');
    setShowStartPicker(true);
  };

  const showEndDateTimePicker = () => {
    setPickerMode('date');
    setShowEndPicker(true);
  };

  const onStartDateTimeChange = (event, selectedDate) => {
    if (event.type === 'set') {
      if (Platform.OS === 'ios') {
        if (isWholeDay) {
          selectedDate.setHours(0, 0);
        }
        setPostStartDateTime(selectedDate);
      } else {
        if (pickerMode === 'date') {
          const currentDate = new Date(postStartDateTime || new Date());
          currentDate.setFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );
          if (isWholeDay) {
            selectedDate.setHours(0, 0);
          }
          setShowStartPicker(false);
          setPickerMode('time');
          setShowStartPicker(true);
          setPostStartDateTime(currentDate);
        } else {
          const currentDate = new Date(postStartDateTime || new Date());
          currentDate.setHours(
            selectedDate.getHours(),
            selectedDate.getMinutes(),
          );
          setShowStartPicker(false);
          setPostStartDateTime(currentDate);
        }
      }
    } else {
      setShowStartPicker(false);
    }
  };

  const onEndDateTimeChange = (event, selectedDate) => {
    if (event.type === 'set') {
      if (Platform.OS === 'ios') {
        if (isWholeDay) {
          selectedDate.setHours(0, 0);
        }
        setPostEndDateTime(selectedDate);
      } else {
        if (pickerMode === 'date') {
          const currentDate = new Date(postEndDateTime || new Date());
          currentDate.setFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );
          if (isWholeDay) {
            selectedDate.setHours(0, 0);
          }
          setShowEndPicker(false);
          setPickerMode('time');
          setShowEndPicker(true);
          setPostEndDateTime(currentDate);
        } else {
          const currentDate = new Date(postEndDateTime || new Date());
          currentDate.setHours(
            selectedDate.getHours(),
            selectedDate.getMinutes(),
          );
          setShowEndPicker(false);
          setPostEndDateTime(currentDate);
        }
      }
    } else {
      setShowEndPicker(false);
    }
  };

  const [isWholeDay, setIsWholeDay] = useState(false);

  const toggleWholeDay = () => {
    setIsWholeDay(prevIsWholeDay => !prevIsWholeDay);
  };

  const formatDate = date => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based, so we add 1
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDate = `${year}年${month}月${day}日`;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;

    return {formattedDate, formattedTime};
  };

  clearPostDescribe = () => {
    setPostDescribe('');
  };

  const enteredPostDescribe = postDescribe => {
    if (true) return true;
    return false;
  };

  //   const handleLogin = async () => {
  //     const response = await fetch(
  //       `https://api.whomethser.synology.me:3560/visualgo/v1/vtLogin`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({email, password}),
  //       },
  //     );

  //     const data = await response.json();

  //     if (data.success) {
  //       console.log('Data: \n', JSON.stringify(data));
  //       await AsyncStorage.setItem('vtEmail', JSON.stringify(data.vtEmail));
  //       await AsyncStorage.setItem('vtName', JSON.stringify(data.vtName));
  //       await AsyncStorage.setItem('districtID', JSON.stringify(data.districtID));
  //       await AsyncStorage.setItem('vtBuilding', JSON.stringify(data.vtBuilding));
  //       await AsyncStorage.setItem('vtToken', data.vtToken);
  //       // navigation.navigate('VTPages', {screen: 'VTHomepage'});
  //       // route.params.navigateToVTHomepage(navigation);

  //       navigation.navigate('VTPages', {
  //         screen: 'VTHomepage',
  //       });
  //     } else if (data.message == 'Invalid email or password') {
  //       alert('電郵或密碼錯誤，請重新輸入。');
  //       console.error('failed:\n', data.message);
  //     } else {
  //       alert('網絡錯誤');
  //       console.error('failed:\n', data.message);
  //     }
  //   };

  // addEvent = () => {
  //   if (!email.trim() && !password.trim() && !email.match(emailRegex)) {
  //     setEnterEmail(false);
  //     setValidEmail(true);
  //     setEnterPassword(false);
  //   } else if (!email.trim()) {
  //     // alert('請輸入電郵地址\nPlease enter your address');
  //     setEnterEmail(false);
  //     setValidEmail(true);
  //   } else if (!email.match(emailRegex)) {
  //     // alert(
  //     //   '電郵地址格式錯誤，請重新輸入\nInvalid format of email address, please type again.',
  //     // );
  //     setValidEmail(false);
  //   } else if (!password.trim()) {
  //     setEnterPassword(false);
  //   } else {
  //     console.log(email, ' ', password);
  //     handleLogin();
  //   }
  // };

  addEvent = () => {
    if (!postTitle.trim() && !postDescribe.trim()) {
      setEnterPostTitle(false);
      setEnterPostDescribe(false);
    }
    if (!postTitle.trim()) {
      setEnterPostTitle(false);
    } else if (!postDescribe.trim()) {
      setEnterPostDescribe(false);
    } else {
      console.log('fill ok');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.leftContainer}></View>
        <View style={styles.rightContainerTitle}>
          <TextInput style={styles.inputTitle} placeholder="輸入標題" />
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
          <Ionicons name={'time-outline'} size={30} />
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.container}>
            <Text style={{fontSize: 20}}>全日</Text>
            <Switch value={isWholeDay} onValueChange={toggleWholeDay} />
          </View>

          {/* StartDateTime */}
          <TouchableOpacity onPress={showStartDateTimePicker}>
            <Text style={styles.input}>
              {postStartDateTime ? (
                <>
                  <View style={styles.container}>
                    <View>
                      <Text style={{fontSize: 20}}>
                        {formatDate(postStartDateTime).formattedDate}
                      </Text>
                    </View>
                    <View>
                      <Text style={{fontSize: 20}}>
                        {formatDate(postStartDateTime).formattedTime}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                '選取開始日期'
              )}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <View style={{paddingRight: 50}}>
              <DateTimePicker
                testID="startDateTimePicker"
                value={postStartDateTime || new Date()}
                mode={Platform.OS === 'ios' ? 'datetime' : pickerMode}
                display="default"
                onChange={onStartDateTimeChange}
              />
            </View>
          )}

          {/* EndDateTime */}
          <TouchableOpacity onPress={showEndDateTimePicker}>
            <Text style={styles.input}>
              {postEndDateTime ? (
                <>
                  <View style={styles.container}>
                    <View>
                      <Text style={{fontSize: 20}}>
                        {formatDate(postEndDateTime).formattedDate}
                      </Text>
                    </View>
                    <View>
                      <Text style={{fontSize: 20}}>
                        {formatDate(postEndDateTime).formattedTime}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                '選取結束日期'
              )}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <View style={{paddingRight: 50}}>
              <DateTimePicker
                testID="endDateTimePicker"
                value={postEndDateTime || new Date()}
                mode={Platform.OS === 'ios' ? 'datetime' : pickerMode}
                display="default"
                onChange={onEndDateTimeChange}
              />
            </View>
          )}
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
          <Ionicons name={'map-outline'} size={30} />
        </View>
        <View style={styles.rightContainer}>
          <TextInput style={styles.input} placeholder="輸入地點" />
        </View>
      </View>
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
          />
        </View>
      </View>
    </ScrollView>

    // <ScrollView>
    //   <View style={styles.inputField}>
    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         borderBottomColor: '#ccc',
    //         borderBottomWidth: 1,
    //         paddingBottom: 8,
    //         marginBottom: 10,
    //       }}>
    //       <TextInput
    //         placeholder={'輸入標題'}
    //         style={{flex: 1, paddingVertical: 0, fontSize: 30}}
    //         onChangeText={postTitle => {
    //           setPostTitle(postTitle);
    //           const isEnteredEvent = enteredPostTitle(postTitle);
    //           isEnteredEvent
    //             ? setEnterPostTitle(true)
    //             : setEnterPostTitle(false);
    //         }}
    //         value={postTitle}
    //       />
    //       <TouchableOpacity
    //         onPress={this.clearPostTitle}
    //         accessible={true}
    //         accessibilityLabel={'清除'}>
    //         <Ionicons name={'close-sharp'} size={25} />
    //       </TouchableOpacity>
    //     </View>

    //     <Text style={styles.inputErr}>
    //       {isEnterPostTitle ? '' : '請輸入標題'}
    //     </Text>
    //   </View>

    //   <View style={styles.inputDescribeField}>
    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         borderBottomColor: '#ccc',
    //         borderBottomWidth: 1,
    //         paddingBottom: 8,
    //         marginBottom: 10,
    //       }}>
    //       <TextInput
    //         placeholder={'輸入內容'}
    //         style={{flex: 1, paddingVertical: 0, fontSize: 18}}
    //         onChangeText={postDescribe => {
    //           setPostDescribe(postDescribe);
    //           const isEnteredEvent = enteredPostTitle(postDescribe);
    //           isEnteredEvent
    //             ? setEnterPostDescribe(true)
    //             : setEnterPostDescribe(false);
    //         }}
    //         value={postDescribe}
    //       />
    //       <TouchableOpacity
    //         onPress={this.clearPostDescribe}
    //         accessible={true}
    //         accessibilityLabel={'清除'}>
    //         <Ionicons name={'close-sharp'} size={25} />
    //       </TouchableOpacity>
    //     </View>

    //     <Text style={styles.inputErr}>
    //       {isEnterPostDescribe ? '' : '請輸入內容'}
    //     </Text>
    //   </View>
    //   <View
    //     style={{
    //       borderBottomColor: 'grey',
    //       borderBottomWidth: StyleSheet.hairlineWidth,
    //       marginTop: '10%',
    //     }}
    //   />

    //   <Text>Date</Text>
    //   <Text>Time</Text>
    //   <Text>Location</Text>

    //   <TouchableOpacity
    //     style={[
    //       styles.loginBtn,
    //       {
    //         backgroundColor: '#ADECC1',
    //         opacity: 1,
    //       },
    //     ]}
    //     onPress={this.addEvent}>
    //     <Text style={styles.btnTxt}>添加活動</Text>
    //   </TouchableOpacity>
    // </ScrollView>
  );
}

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
  rightContainerTitle: {
    flexGrow: 1,
    marginLeft: 8,
    marginTop: 10,
  },
  rightContainer: {
    flexGrow: 1,
    marginLeft: 15,
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
});

export default VTAddNewsPage;
