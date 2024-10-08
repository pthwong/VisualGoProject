import {React, useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Switch,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message-large';

function VTEditNewsPage({route}) {
  const {data: postID} = route.params;

  const locationName = route.params?.locationName;

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            leaveEditPress();
          }}
          style={{marginLeft: 5}}>
          <Ionicons name="close-outline" size={40} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => editNews()} style={{marginLeft: 5}}>
          <Text style={{fontSize: 18}}>保存</Text>
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

  const [postTitle, setPostTitle] = useState('');
  const [isEnterPostTitle, setEnterPostTitle] = useState(true);
  const [postDescribe, setPostDescribe] = useState('');
  const [isEnterPostDescribe, setEnterPostDescribe] = useState(true);
  const [postStartDateTime, setPostStartDateTime] = useState('');
  const [postEndDateTime, setPostEndDateTime] = useState('');
  const [postBuilding, setPostBuilding] = useState(undefined);
  const [district, setDistrict] = useState('');
  const [vtEmail, setVtEmail] = useState('');

  const [loading, setLoading] = useState(false);

  const fetchPostData = async postID => {
    try {
      const response = await fetch(
        `https://api.whomethser.synology.me:3560/visualgo/v1/news/${postID}`,
      );
      const data = await response.json();
      if (data.error) {
        console.log('API error: ', data.error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    getPostData();
    getEmail();
  }, [getPostData]);

  const getPostData = useCallback(async () => {
    setLoading(true);
    const postData = await fetchPostData(postID);
    console.log('postData: ', postData);
    setPostTitle(postData.response.postTitle);
    setPostDescribe(postData.response.postDescribe);
    setPostStartDateTime(new Date(postData.response.postStartDateTime));
    setPostEndDateTime(new Date(postData.response.postEndDateTime));
    setPostBuilding(postData.response.postBuilding);
    setDistrict(postData.response.districtID);
    setLoading(false);
  }, [postID]);

  useEffect(() => {
    if (locationName) {
      setPostBuilding(locationName);
    }
  }, [locationName]);

  const getEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('vtEmail');
      setVtEmail(email);
    } catch (error) {
      console.error('Error getting email:\n', error);
    }
  };

  leaveEditPress = () => {
    {
      Alert.alert(
        '確定取消更新社區資訊？',
        '取消後需要重新更新社區資訊',
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
    }
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

  const districtList = [
    {label: '中西區', value: 'CEW'},
    {label: '東區', value: 'EAS'},
    {label: '南區', value: 'SOU'},
    {label: '灣仔區', value: 'WAC'},
    {label: '九龍城區', value: 'KOC'},
    {label: '觀塘區', value: 'KWT'},
    {label: '深水埗區', value: 'SSP'},
    {label: '黃大仙區', value: 'WTS'},
    {label: '油尖旺區', value: 'YTM'},
    {label: '離島區', value: 'ISL'},
    {label: '葵青區', value: 'KWA'},
    {label: '北區', value: 'NOR'},
    {label: '西貢區', value: 'SAK'},
    {label: '沙田區', value: 'SHT'},
    {label: '大埔區', value: 'TAP'},
    {label: '荃灣區', value: 'TSW'},
    {label: '屯門區', value: 'TUM'},
    {label: '元朗區', value: 'YUL'},
    {label: '全港', value: 'HOK'},
  ];

  editNews = async () => {
    console.log(
      'Result: \n',
      postTitle,
      postStartDateTime,
      postEndDateTime,
      postBuilding,
      district,
      postDescribe,
      vtEmail,
    );

    if (postTitle == '') {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '請填妥標題',
        text2: '',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 100,
      });
    } else if (postStartDateTime == '' || postEndDateTime == '') {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '請選取開始及結束日期',
        text2: '',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 100,
      });
    } else if (district == undefined) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '請選擇地區',
        text2: '',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 100,
      });
    } else {
      try {
        const response = await fetch(
          `https://api.whomethser.synology.me:3560/visualgo/v1/updateCommunityNews/${postID}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              postTitle,
              postDescribe,
              postStartDateTime,
              postEndDateTime,
              postBuilding,
              district,
              vtEmail,
            }),
          },
        );
        if (response.status === 201) {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: '社區資訊已修改',
            text2: '',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 100,
          });
          console.log('Post edited successfully:\n', response.data);
          navigation.goBack();
        } else {
          console.error(
            'Error updating post 1:\n',
            response.status,
            '\nResponse:',
            response,
          );
          if (!response.ok) {
            const errorBody = await response.json();
            console.log('Error response body:', errorBody);
          }
        }
      } catch (error) {
        console.error('Error updating post 2:\n', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 200}}>
          <View style={styles.container}>
            <View style={styles.leftContainer}></View>
            <View style={styles.rightContainerTitle}>
              <TextInput
                style={styles.inputTitle}
                placeholder="輸入標題"
                value={postTitle}
                multiline={true}
                numberOfLines={2}
                onChangeText={postTitle => setPostTitle(postTitle)}
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
              {postBuilding === undefined || postBuilding === '' ? (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => {
                    navigation.navigate('LocationSearch', {mode: 'edit'});
                  }}>
                  <View style={styles.childContainer}>
                    <Text style={({fontSize: 20}, styles.leftArrowContainer)}>
                      選取地點
                    </Text>
                    <Ionicons
                      style={styles.rightArrowContainer}
                      name={'chevron-forward-outline'}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => {
                    navigation.navigate('LocationSearch', {mode: 'edit'});
                  }}>
                  <View style={styles.childContainer}>
                    <Text
                      style={({fontSize: 20}, styles.leftArrowContainer)}
                      lineBreakMode="tail">
                      {postBuilding}
                    </Text>
                    <Ionicons
                      style={styles.rightArrowContainer}
                      name={'chevron-forward-outline'}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>
              )}

              <Picker
                selectedValue={district}
                onValueChange={value => setDistrict(value)}
                style={styles.picker}>
                <Picker.Item label="選取區域..." value={null} />
                {districtList.map((district, index) => (
                  <Picker.Item
                    key={index}
                    label={district.label}
                    value={district.value}
                  />
                ))}
              </Picker>
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
                value={postDescribe}
                onChangeText={postDescribe => {
                  setPostDescribe(postDescribe);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default VTEditNewsPage;

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
  childContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftArrowContainer: {
    alignItems: 'flex-start',
    fontSize: 25,
    color: '#000000',
    marginRight: 8,
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
  rightArrowContainer: {
    flex: 1,
    alignItems: 'flex-end',
    color: 'black',
    textAlign: 'right',
    paddingVertical: 10,
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
