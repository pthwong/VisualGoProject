import {React, useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  BackHandler,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';

function VICommunityDetailsPage({route}) {
  const {data: postID} = route.params;

  const locationName = route.params?.locationName;

  const navigation = useNavigation();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = () => {
    navigation.goBack();
    return true;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{marginLeft: 4}}
          accessible={true}
          accessibilityLabel="返回社區資訊頁面">
          <Ionicons name="chevron-back-outline" size={40} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [postTitle, setPostTitle] = useState('');
  const [isEnterPostTitle, setEnterPostTitle] = useState(true);
  const [postDescribe, setPostDescribe] = useState('');
  const [isEnterPostDescribe, setEnterPostDescribe] = useState(true);
  const [postStartDateTime, setPostStartDateTime] = useState('');
  const [postEndDateTime, setPostEndDateTime] = useState('');
  const [postBuilding, setPostBuilding] = useState(undefined);
  const [district, setDistrict] = useState('');
  const [districtName, setDistrictName] = useState('');
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

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  const [isWholeDay, setIsWholeDay] = useState(false);

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
  useEffect(() => {
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

    const districtObject = districtList.find(
      districtRes => districtRes.value === district,
    );

    const value = districtObject ? districtObject.label : '';
    setDistrictName(value);
  }, [district]);

  return (
    <ScrollView>
      <View
        style={styles.container}
        accessible={true}
        accessibilityLabel={('資訊標題：', postTitle)}>
        <View style={styles.leftContainer}></View>
        <View style={styles.rightContainerTitle}>
          <Text style={styles.inputTitle}>{postTitle}</Text>
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
        <View
          style={styles.leftContainer}
          accessible={true}
          accessibilityLabel={'時間'}>
          <Ionicons name={'time-outline'} size={35} />
        </View>
        <View
          style={styles.rightContainer}
          accessibilityLabel={`由${
            formatDate(new Date(postStartDateTime)).formattedDate
          } ${formatDate(new Date(postStartDateTime)).formattedTime}至${
            formatDate(new Date(postEndDateTime)).formattedDate
          } ${formatDate(new Date(postEndDateTime)).formattedTime}`}>
          {/* StartDateTime */}
          {postStartDateTime ? (
            <>
              <View style={styles.container}>
                <View>
                  <Text style={styles.input}>
                    {formatDate(postStartDateTime).formattedDate}
                  </Text>
                </View>
                <View>
                  <Text style={styles.input}>
                    {formatDate(postStartDateTime).formattedTime}
                  </Text>
                </View>
              </View>
            </>
          ) : null}

          {/* EndDateTime */}
          {postEndDateTime ? (
            <>
              <View style={styles.container}>
                <View>
                  <Text style={styles.input}>
                    {formatDate(postEndDateTime).formattedDate}
                  </Text>
                </View>
                <View>
                  <Text style={styles.input}>
                    {formatDate(postEndDateTime).formattedTime}
                  </Text>
                </View>
              </View>
            </>
          ) : null}
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
        <View
          style={styles.leftContainer}
          accessible={true}
          accessibilityLabel={'地點：'}>
          <Ionicons name={'map-outline'} size={35} />
        </View>
        <View style={styles.rightContainer}>
          {postBuilding === undefined || postBuilding === '' ? (
            <>
              <View accessible={true} accessibilityLabel={'沒有建築物名稱'}>
                <Text style={styles.input}>---</Text>
              </View>
            </>
          ) : (
            <View
              accessible={true}
              accessibilityLabel={`建築物名稱：${postBuilding}`}>
              <Text style={styles.input} lineBreakMode="tail">
                {postBuilding}
              </Text>
            </View>
          )}
          <View accessible={true} accessibilityLabel={`地區：${districtName}`}>
            <Text style={styles.input}>{districtName}</Text>
          </View>
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
        <View
          style={styles.leftContainer}
          accessible={true}
          accessibilityLabel={'詳細內容：'}>
          <Ionicons name={'document-text-outline'} size={35} />
        </View>
        <View style={styles.rightContainer}>
          {postDescribe ? (
            <>
              <Text style={styles.input}>{postDescribe}</Text>
            </>
          ) : (
            <Text
              style={styles.input}
              accessibilityLabel="沒有詳細內容">{`---`}</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default VICommunityDetailsPage;

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
    fontSize: 30,
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
  },
  regBtn: {
    backgroundColor: '#ffd63f',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '4%',
    marginTop: '10%',
    borderRadius: 50,
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
