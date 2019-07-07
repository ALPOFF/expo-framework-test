import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

import { Button } from 'react-native';

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  _sendLocation = () => {
    axios.post(
        'http://u0755299.cp.regruhosting.ru/scripts/testapp.php',
        {
          'param1': 'value1',
          'param2': 'value2',
          //other data key value pairs
        },
        {
          headers: {
            'api-token': 'xyz',
            //other header fields
          }
        }
    );
  }


  render() {
    let text = 'Waiting..';
    let long;
    let lat;
    let acc;
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
      long = JSON.stringify(this.state.location.coords.longitude);
      lat = JSON.stringify(this.state.location.coords.latitude);
      acc = JSON.stringify(this.state.location.coords.accuracy)
    }


    return (
          <View style={styles.container}>
            <Button
                onPress={() => {
                  this._getLocationAsync();
                  alert("Данные обновлены и отправлены ...");
                  this._sendLocation();
                }}
                title="Обновить и отправить свое местоположение"
            />
            {/*<Text style={styles.paragraph}>{text}</Text>*/}
            <Text style={styles.paragraph}>Долгота: {long}</Text>
            <Text style={styles.paragraph}>Широта: {lat}</Text>
            <Text style={styles.paragraph}>Точность данных: {acc}</Text>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#9ecff1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});
