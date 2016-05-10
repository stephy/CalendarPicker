# react-native-calendar-picker
Calendar Picker Component for React Native [![Build Status](https://travis-ci.org/stephy/CalendarPicker.svg?branch=master)](https://travis-ci.org/stephy/CalendarPicker)


This is a Calendar Picker Component for React Native
![alt tag](https://raw.github.com/stephy/CalendarPicker/master/calendarPicker.gif)

To use the calendar you just need to:

	npm install react-native-calendar-picker

How to use it:
```js
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';

var CalendarPicker = require('react-native-calendar-picker'),
    CalendarPicker2;

CalendarPicker2 = React.createClass({
  getInitialState: function() {
    return {
      date: new Date(),
    };
  },

  onDateChange: function(date) {
    this.setState({ date: date });
  },

  render: function() {
    return (
      <View style={styles.container}>

        <CalendarPicker 
          selectedDate={this.state.date}
          onDateChange={this.onDateChange}
          screenWidth={Dimensions.get('window')}
          selectedBackgroundColor={'#5ce600'} />

        <Text style={styles.selectedDate}> Date: { this.state.date.toString() } </Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  selectedDate: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#000',
  }
});
```
## CalendarPicker props
| Prop | Type | Description |
:------------ |:---------------:| :-----|
| weekdays | array | List of week days. Eg. ['Mo', 'Tue', ...] Must be 7 days |
| months | array | List of months names. |
| startFromMonday | boolean | Default first day of week will be Sunday. You can set start of week from Monday. |
| previousTitle | string | Title of button for previous month. |
| nextTitle | string | Title of button for next month. |
| selectedDayColor | string | Color for selected day |
| scaleFactor | float | Optional. Default scales to window width |


# To Do:

- Add swipe gestures
- Add ability to select date range


# Suggestions?

Drop an email to alves@stephanimoroni.com

Open issues

Submit PRs.


# Special thanks

I would like to call out some contributors who have been helping with this project

@edvinerikson
@thomaswright
@brentvatne
@kesha-antonov
@jthestupidkid
@adamkrell
@joshuapinter
