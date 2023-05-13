import {addDays, format, differenceInDays} from 'date-fns';
import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Alert,
  BackHandler,
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Swipeable} from 'react-native-gesture-handler';
import {RectButton} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message-large';

LocaleConfig.locales['zh'] = {
  monthNames: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  monthNamesShort: [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '十一',
    '十二',
  ],
  dayNames: [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ],
  dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
};

LocaleConfig.defaultLocale = 'zh';

function VTCommunityPage() {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState(null);
  const [postID, setPostID] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const getData = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      'https://api.whomethser.synology.me:3560/visualgo/v1/news',
    );
    const {response: data} = await response.json();

    const mappedData = data.map(post => {
      const startDate = new Date(post.postStartDateTime);
      const endDate = new Date(post.postEndDateTime);

      const startDateTime = format(startDate, 'yyyy-MM-dd HH:mm');
      const endDateTime = format(endDate, 'yyyy-MM-dd HH:mm');

      const daysDifference = differenceInDays(endDate, startDate);

      const eventDates = Array.from(
        {length: daysDifference + 1},
        (_, index) => {
          const currentDate = addDays(startDate, index);
          return format(currentDate, 'yyyy-MM-dd');
        },
      );

      return {
        ...post,
        postID: post.postID,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        startDateTime,
        endDateTime,
        postStartDateTime: post.postStartDateTime,
        postEndDateTime: post.postEndDateTime,
        postTitle: post.postTitle,
        postDescribe: post.postDescribe,
        postBuilding: post.postBuilding,
        districtID: post.districtID,
        eventDates,
      };
    });

    const reduced = mappedData.reduce((acc, currentItem) => {
      const {eventDates} = currentItem;

      eventDates.forEach(date => {
        if (!acc[date]) {
          acc[date] = [];
        }

        acc[date].push(currentItem);
      });

      return acc;
    }, {});

    setPostID(mappedData.postID);
    setItems(reduced);
    setLoading(false);
    // console.log('News data:\n', newsData);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const navigation = useNavigation();

  editNewsPress = postID => {
    navigation.navigate('VTEditNewsPage', {data: postID});
  };

  const deletePost = (progress, dragX, postID) => {
    const onPress = () => {
      Alert.alert(
        '確定刪除此社區資訊？',
        '取消後需要重新建立社區資訊',
        [
          {
            text: '取消',
            onPress: () => console.log('Cancel Pressed'),
          },
          {
            text: '確定',
            onPress: async () => {
              try {
                // Call your API to delete the item from the database
                const response = await fetch(
                  `https://api.whomethser.synology.me:3560/visualgo/v1/deleteCommunityNews/${postID}`,
                  {
                    method: 'DELETE',
                  },
                );
                if (response.status === 201) {
                  Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: '此社區資訊已刪除',
                    text2: '',
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 30,
                    bottomOffset: 100,
                  });
                  console.log('Post deleted successfully:\n', response.data);
                } else {
                  Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: '刪除社區資訊時出現錯誤',
                    text2: '',
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 30,
                    bottomOffset: 100,
                  });
                  console.log('Post deleted error:\n', response.data);
                }
              } catch (error) {
                Toast.show({
                  type: 'error',
                  position: 'bottom',
                  text1: '刪除社區資訊時出現錯誤',
                  text2: '',
                  visibilityTime: 3000,
                  autoHide: true,
                  topOffset: 30,
                  bottomOffset: 100,
                });
                Alert.alert('Error deleting news', error.message);
              }
            },
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    };

    return (
      <RectButton style={styles.deleteButton} onPress={onPress}>
        <Text style={styles.deleteButtonText}>刪除社區資訊</Text>
      </RectButton>
    );
  };

  const renderItem = item => {
    if (item.postTitle === undefined) {
      return (
        <View style={styles.itemContainer}>
          <Text style={styles.noNewsText}>No news for this day</Text>
        </View>
      );
    }

    return (
      <View>
        <Swipeable
          renderRightActions={(progress, dragX) =>
            deletePost(progress, dragX, item.postID)
          }>
          <TouchableOpacity onPress={() => editNewsPress(item.postID)}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{item.postTitle}</Text>
              <Text style={styles.itemSubTitle}>{item.postDescribe}</Text>
              <Text>{item.building}</Text>
              <Text>
                由 {item.startDateTime} 至 {item.endDateTime}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginTop: '4%',
            }}
          />
        </Swipeable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Agenda
        items={items}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getData} />
        }
        onDayPress={day => setSelectedDate(day.dateString)}
      />
    </SafeAreaView>
  );
}
export default VTCommunityPage;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 25,
  },
  itemSubTitle: {
    fontSize: 20,
  },
  itemContainer: {
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noNewsText: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
