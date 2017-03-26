import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import CalendarPicker from './CalendarPicker';

export default class App extends Component {
  render() {
    const minDate = new Date();
    const maxDate = new Date(2017, 6, 3);
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
          selectedDayColor="#ff1aff"
          selectedDayTextColor="#FFFFFF"
          scaleFactor={375}
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
