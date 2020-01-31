import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import CalendarPicker from './CalendarPicker';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      minDate: new Date(2020, 0, 20),
      maxDate: new Date(2020, 1, 30)
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
      minDate: new Date(2020, 0, 24),
    });
  }
  render() {
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const initialDate = this.state.minDate;
    return (
      <View style={styles.container}>
        <CalendarPicker
          onDateChange={this.onDateChange}
          initialDate={initialDate}
          minDate={this.state.minDate}
  				maxDate={this.state.maxDate}
        />

        <View>
          <Text>SELECTED DATE:{ startDate }</Text>
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
