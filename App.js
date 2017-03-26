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
      selectedEndDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date, type) {
    console.log('TYPE: ', type);
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
      });
    }
  }

  render() {
    const minDate = new Date(); // Today
    const maxDate = new Date(2017, 6, 3);
    console.log('this.state.selectedStartDate: ', this.state.selectedStartDate);
    console.log('this.state.selectedEndDate: ', this.state.selectedEndDate);
    return (
      <View style={styles.container}>
        <CalendarPicker
          startFromMonday={false}
          allowRangeSelection={true}
          minDate={minDate}
          maxDate={maxDate}
          weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']}
          months={['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
          previousTitle="Anterior"
          nextTitle="Proximo"
          todayBackgroundColor="#666666"
          selectedDayColor="#ff1aff"
          selectedDayTextColor="#FFFFFF"
          scaleFactor={375}
          onDateChange={this.onDateChange}
        />
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
