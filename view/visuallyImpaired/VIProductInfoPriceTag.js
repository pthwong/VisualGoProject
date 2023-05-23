import React from 'react';
import {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  List,
  ListItem,
  FlatList,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';

function VIProductInfoPriceTag({route}) {
  const navigation = useNavigation();
  // const route = useRoute();
  const {ProductNameCN: ProductNameCN} = route.params;
  const {ProductNameEN: ProductNameEN} = route.params;
  const {Price1: Price1} = route.params;
  const {Price2: Price2} = route.params;
  const {BrandCN: BrandCN} = route.params;
  const {BrandEN: BrandEN} = route.params;
  const {ProductUnit: ProductUnit} = route.params;
  const {PriceType1: PriceType1} = route.params;
  const {PriceType2: PriceType2} = route.params;

  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('VIVisualSuppPage');
          }}
          style={{marginLeft: 4}}
          accessible={true}
          accessibilityLabel="返回視覺支援頁面">
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
    navigation.navigate('VIVisualSuppPage');
    return true;
  };

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={{fontSize: 30}}>載入中...</Text>
        </View>
      )}
      <View style={styles.flatlist}>
        <>
          {ProductNameCN !== '' ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="產品中文名：">
                    產品中文名
                  </Text>
                  <Text style={styles.infoRightContainer}>{ProductNameCN}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {ProductNameEN !== '' ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="產品英文名：">
                    產品英文名
                  </Text>
                  <Text style={styles.infoRightContainer}>{ProductNameEN}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {BrandCN !== '' ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="品牌中文名：">
                    品牌中文名
                  </Text>
                  <Text style={styles.infoRightContainer}>{BrandCN}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {BrandEN !== '' ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="品牌英文名：">
                    品牌英文名
                  </Text>
                  <Text style={styles.infoRightContainer}>{BrandEN}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {Price1 !== '' ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="標準價：">
                    標準價
                  </Text>
                  <Text style={styles.infoRightContainer}>{`$${Price1}`}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {Price2 !== '' ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="優惠價：">
                    優惠價
                  </Text>
                  <Text style={styles.infoRightContainer}>{`${Price2}`}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {ProductUnit !== '' ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="重量或容量：">
                    重量/容量
                  </Text>
                  <Text style={styles.infoRightContainer}>{ProductUnit}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
      </View>
    </ScrollView>
  );
}

export default VIProductInfoPriceTag;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 25,
    color: 'black',
  },
  subheading: {
    color: 'black',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  infoLeftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    fontSize: 25,
    color: '#1760b0',
    paddingLeft: '3%',
  },
  infoRightContainer: {
    flex: 1.5,
    alignItems: 'flex-end',
    fontSize: 25,
    color: 'black',
    textAlign: 'right',
    paddingRight: '3%',
  },
  hLine: {
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: '5%',
    marginTop: '5%',
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // This will give a slight dark background
    alignItems: 'center', // horizontal center
    justifyContent: 'center', // vertical center
  },
});
