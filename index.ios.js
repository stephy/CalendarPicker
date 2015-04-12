/**
 * Calendar 
 * 
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var CalendarPicker = require('./CalendarPicker');

var Calendar = React.createClass({
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
          onDateChange={this.onDateChange} />

        <Text style={styles.selectedDate}>Date:  { this.state.date.toString() } </Text>
      </View>
      
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },

  selectedDate: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#000',
    marginLeft: 20
  }
});

AppRegistry.registerComponent('Calendar', () => Calendar);
