/**
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
'use strict';

import React from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';

var CalendarPicker = require('./CalendarPicker/CalendarPicker'),
  CalendarPicker2;


CalendarPicker2 = React.createClass({
  getInitialState: function() {
    return {
      date: new Date(),
      start_date: new Date(),
      rangeSelection: true,
      end_date: null
    };
  },

  onDateChange: function(date) {
    if(this.state.rangeSelection)
      this.setState({ start_date: date.start_date, end_date: date.end_date});
    else
      this.setState({ date: date });
  },

  render: function() {
    return (
      <View style={styles.container}>

      <CalendarPicker
          selectedDate={this.state.date}
          fromDate={this.state.start_date}
          toDate={this.state.end_date}
          onDateChange={this.onDateChange}
          allowRangeSelection={true}
          screenWidth={Dimensions.get('window').width}
          weekdays = {['Mon', 'Tue', 'Wed', 'Th', 'Fri', 'Sat', 'Sun']}
          months = {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']}
          nextTitle={'Next'}
          previousTitle={'Previous'}
          startFromMonday={true}
          selectedDayColor={'#E12518'}
          textStyle={styles.calendarTextStyle}
          selectedDayTextColor={'#FFFFFF'}
                style={{}} />

        { ! this.state.rangeSelection &&
          <Text style={styles.selectedDate}> Date: { this.state.date.toString() } </Text>}
        { this.state.rangeSelection &&
          <View>
            { this.state.start_date && <Text style={styles.selectedDate}> Start date: { this.state.start_date.toString() } </Text> }
            { this.state.end_date && <Text style={styles.selectedDate}> End date: { this.state.end_date.toString() } </Text> }
          </View>
        }
      </View>

    );
  }
});

const styles = StyleSheet.create({
  container: {
    marginTop: 30
  },
  selectedDate: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#000'
  },
  calendarTextStyle: {
    color: '#000',
    fontFamily: 'Arial'
  }
});

AppRegistry.registerComponent('CalendarPicker2', () => CalendarPicker2);
