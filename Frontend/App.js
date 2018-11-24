import { LocaleProvider } from "antd-mobile-rn";
import enUS from 'antd-mobile-rn/lib/locale-provider/en_US';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { List, TextareaItem, DatePicker, Button } from 'antd-mobile-rn';
import End_display  from './End_display';
import fetch from 'cross-fetch';


export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
      return <End_display />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 50,
    height: "100%"
  },
  box: {
    width: 250
  },
  date:{
    width: 300
  },
  list:{
    height: 50  
  },
  button: {
    width: '100%'
  }
});