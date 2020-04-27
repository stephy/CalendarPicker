import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import moment from 'moment';
import CalendarPicker from './CalendarPicker';

export default class App extends Component {
  constructor(props) {
    super(props);

    let minDate = moment().subtract(10, 'day');
    let day = minDate.clone();
    let customDatesStyles = [];
    for (let i = 0; i < 30; i++) {
      customDatesStyles.push({
        date: day.clone(),
        // Random colors
        style: {backgroundColor: '#'+('#00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)},
        textStyle: {color: 'black'}, // sets the font color
        containerStyle: [], // extra styling for day container
      });
      day.add(1, 'day');
    }

    let dayOfWeekStyles = {
      5: {
        color: '#00f',
        fontWeight: 'bold',
      }
    };

    this.state = {
      selectedStartDate: null,
      minDate,
      maxDate: moment().add(90, 'day'),
      customDatesStyles,
      dayOfWeekStyles,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }

  render() {
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.format('YYYY-MM-DD') : '';
    const initialDate = this.state.minDate;
    return (
      <View style={styles.container}>
        <CalendarPicker
          onDateChange={this.onDateChange}
          initialDate={initialDate}
          minDate={this.state.minDate}
  				maxDate={this.state.maxDate}
          customDatesStyles={this.state.customDatesStyles}
          dayOfWeekStyles={this.state.dayOfWeekStyles}
        />

        <View>
          <Text>SELECTED DATE:  { startDate }</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
  },
});
