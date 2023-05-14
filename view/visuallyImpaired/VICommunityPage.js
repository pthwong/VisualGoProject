import {useNavigation} from '@react-navigation/native';
import {addDays, format, differenceInDays} from 'date-fns';
import React, {useEffect, useState, useCallback, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

function VICommunityPage() {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);

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
          accessibilityLabel="返回視障人士主頁">
          <Ionicons name="chevron-back-outline" size={40} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        startDateTime,
        endDateTime,
        title: post.postTitle,
        description: post.postDescribe,
        building: post.postBuilding,
        district: post.districtID,
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

    setItems(reduced);
    setLoading(false);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const renderItem = item => {
    if (item.title === undefined) {
      return (
        <View style={styles.itemContainer}>
          <Text style={styles.noNewsText}>No news for this day</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>{item.postTitle}</Text>
          <Text style={styles.itemSubTitle}>{item.postDescribe}</Text>
          <Text>{item.building}</Text>
          <Text>
            由 {item.startDateTime} 至 {item.endDateTime}
          </Text>
        </View>
        <View
          style={{
            borderBottomColor: 'grey',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: '4%',
          }}
        />
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
      />
    </SafeAreaView>
  );
}
export default VICommunityPage;

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
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 15,
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
});
