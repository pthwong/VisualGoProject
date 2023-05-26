import React from 'react';
import {useState, useEffect, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

function LocationSearch({route}) {
  let [searchText, setSearchText] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  console.log('params:', route.params);

  const mode = route.params?.mode;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{marginLeft: 5}}>
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
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    searchBuildings();
  }, [searchText]);

  const searchBuildings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://webapp.hongkongpost.hk/correct_addressing/GetBuildingInput.jsp?building=${searchText}&flag=false`,
      );

      const buildingString = response.data
        .replace('<html><head>', '')
        .replace('</head><body>', '')
        .replace('</body></html>', '')
        .trim()
        .split('|')[1];

      const buildingNames = buildingString.split(',');

      const parsedBuildings = buildingNames.map((buildingName, index) => ({
        buildingId: index,
        buildingName,
      }));

      setLocations(parsedBuildings);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildingPress = buildingName => {
    Alert.alert(
      `你已選取：${buildingName}`,
      '繼續？',
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '確定',
          onPress: () => {
            mode === 'edit'
              ? navigation.navigate('VTEditNewsPage', {
                  locationName: buildingName,
                })
              : navigation.navigate('VTAddNewsPage', {
                  locationName: buildingName,
                });
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="輸入地點"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#000000" />
      ) : (
        <FlatList
          data={locations}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handleBuildingPress(item.buildingName)}>
              <View style={styles.childContainer}>
                <Text
                  style={({fontSize: 20}, styles.leftArrowContainer)}
                  lineBreakMode="tail">
                  {item.buildingName}
                </Text>
                <Ionicons
                  style={styles.rightArrowContainer}
                  name={'chevron-forward-outline'}
                  size={30}
                />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.buildingId}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  leftArrowContainer: {
    alignItems: 'flex-start',
    fontSize: 25,
    color: '#000000',
    marginRight: 8,
  },
  rightArrowContainer: {
    flex: 1,
    alignItems: 'flex-end',
    color: 'black',
    textAlign: 'right',
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 20,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  childContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LocationSearch;
