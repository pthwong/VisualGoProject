import React from 'react';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';

function VICommunityPage() {
  //   const [email, onChangeText] = useState('');
  //   const [password, onChangeText] = useState('');
  const navigation = useNavigation();
  const [selected, setSelected] = useState('');
  const [events, setEvents] = useState({});

  useEffect(() => {
    // Fetch event data from API endpoint
    fetch('https://api.whomethser.synology.me:3560/visualgo/v1/news/')
      .then(response => response.json())
      .then(data => {
        // Format event data for calendar view
        console.log(data);
        const formattedData = {};
        data.forEach(event => {
          const date = event.postStartDateTime.split('T')[0];
          formattedData[date] = formattedData[date] || {marked: true};
          formattedData[date].dots = formattedData[date].dots || [];
          formattedData[date].dots.push({
            key: event.postID,
            color: 'blue',
            selectedDotColor: 'blue',
            marked: true,
          });
        });
        console.log('Data: ', formattedData);
        setEvents(formattedData);
      });
  }, []);

  return (
    <View>
      <Calendar
        onDayPress={day => {
          setSelected(day.dateString);
          console.log('selected day', day.dateString);
        }}
        current={Date().dateString}
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          height: 350,
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
        }}
        markedDates={events}
      />
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
    backgroundColor: '#97F9F9',
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
  btnTxt: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    shadowOpacity: 0.2,
  },
});

export default VICommunityPage;
