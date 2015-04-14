/**
 * Calendar
 *
 */
'use strict';

var CalendarPicker = require('./CalendarPicker/CalendarPicker');
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var Calendar = React.createClass({
  getInitialState: function() {
    return {
      date: new Date(),
    };
  },

  onDateChange: function(date) {
    this.setState({
      date: date,
    });
  },

  render: function() {
    return (
      <View style={styles.container}>
        <CalendarPicker selectedDate={this.state.date}
          onDateChange={this.onDateChange} />

        <Text style={styles.selectedDate}>
          Date: { this.state.date.toString() }
        </Text>
      </View>
    );
  }
});

// react-native style with object literals is to always leaving a comma after
// the last item
var styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  selectedDate: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#000',
  }
});

AppRegistry.registerComponent('Calendar', () => Calendar);
