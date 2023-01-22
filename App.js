import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-elements';
// import NavContainer from './NavContainer';

function App() {
  viPress = () => {
    alert('You are a Visually Impaired');
  };

  vtPress = () => {
    alert('You are a Volunteer');
  };

  return (
    <View>
      <Text style={styles.title1}>歡迎使用{'\n'}Welcome Use</Text>
      <Image
        source={require('./assets/app_icon_white.png')}
        style={styles.logo}
        resizeMode="contain"></Image>
      <Text style={styles.title2}>睛明寶 Visual Go</Text>
      <TouchableOpacity onPress={this.viPress}>
        <Text style={styles.viBtn}>視障人士{'\n'}Visually Impaired</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={this.vtPress}>
        <Text style={styles.vtBtn}>義工{'\n'}Volunteer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title1: {
    marginTop: '20%',
    marginLeft: '10%',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#17d8d1',
  },
  title2: {
    marginTop: '0%',
    marginLeft: '10%',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#17d8d1',
  },
  logo: {
    width: 200,
    height: 200,
    marginLeft: '15%',
    marginTop: '10%',
  },
  viBtn: {
    backgroundColor: '#97F9F9',
    color: 'black',
    width: '75%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '11%',
    padding: '2%',
    fontSize: 27,
    marginTop: '10%',
    borderRadius: 50,
  },
  vtBtn: {
    backgroundColor: '#ADECC1',
    color: 'black',
    width: '75%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '11%',
    padding: '2%',
    fontSize: 27,
    marginTop: '10%',
    borderRadius: 50,
  },
});

export default App;
