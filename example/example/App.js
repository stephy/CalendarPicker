import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Switch,
} from 'react-native';
import { addDays, format, subDays } from 'date-fns';
import CalendarPicker from './CalendarPicker';

export default class App extends Component {
  constructor(props) {
    super(props);

    let minDate = subDays(new Date(), 15);
    let day = minDate;
    let customDatesStyles = [];
    for (let i = 0; i < 30; i++) {
      customDatesStyles.push({
        date: day,
        // Random colors
        style: { backgroundColor: '#' + ('#00000' + (Math.random() * (64 << 22) | 32768).toString(16)).slice(-6) },
        textStyle: { color: 'black' }, // sets the font color
        containerStyle: [], // extra styling for day container
      });
      day = addDays(day, 1);
    }

    this.state = {
      customDatesStyles,
      enableRangeSelect: false,
      minDate,
      maxDate: addDays(new Date(), 90),
      minRangeDuration: "1",
      maxRangeDuration: "5",
      selectedStartDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.clear = this.clear.bind(this);
    this.toggleEnableRange = this.toggleEnableRange.bind(this);
    this.onMinRangeDuration = this.onMinRangeDuration.bind(this);
    this.onMaxRangeDuration = this.onMaxRangeDuration.bind(this);
  }

  onDateChange(date, type) {
    if (type === "START_DATE") {
      this.setState({
        selectedStartDate: date,
      });
    }
    else {
      this.setState({
        selectedEndDate: date,
      });
    }
  }

  clear() {
    this.setState({
      selectedStartDate: null,
      selectedEndDate: null,
    });
  }

  toggleEnableRange(text) {
    this.setState({
      enableRangeSelect: !this.state.enableRangeSelect,
      selectedStartDate: null,
      selectedEndDate: null,
    });
  }

  onMinRangeDuration(val) {
    let parsedVal = parseInt(val);
    this.setState({
      minRangeDuration: val && !isNaN(parsedVal) ? parsedVal + "" : undefined,
      selectedStartDate: null,
      selectedEndDate: null,
    });
  }

  onMaxRangeDuration(val) {
    let parsedVal = parseInt(val);
    this.setState({
      maxRangeDuration: val && !isNaN(parsedVal) ? parsedVal + "" : undefined,
      selectedStartDate: null,
      selectedEndDate: null,
    });
  }

  customDayHeaderStylesCallback({ dayOfWeek, month, year }) {
    switch (dayOfWeek) {
      case 4: // Thursday
        return {
          style: {
            borderRadius: 12,
            backgroundColor: 'cyan',
          },
          textStyle: {
            color: 'blue',
            fontWeight: 'bold',
          }
        };
    }
  }

  render() {
    const {
      customDatesStyles,
      enableRangeSelect,
      minDate,
      maxDate,
      minRangeDuration,
      maxRangeDuration,
      selectedStartDate,
      selectedEndDate,
    } = this.state;
    const formattedStartDate = selectedStartDate ? format(selectedStartDate, 'yyyy-MM-dd') : '';
    const formattedEndDate = selectedEndDate ? format(selectedEndDate, 'yyyy-MM-dd') : '';

    return (
      <View style={styles.container}>
        <CalendarPicker
          scrollable
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          onDateChange={this.onDateChange}
          initialDate={minDate}
          customDatesStyles={customDatesStyles}
          customDayHeaderStyles={this.customDayHeaderStylesCallback}
          minDate={minDate}
          maxDate={maxDate}
          allowRangeSelection={enableRangeSelect}
          allowBackwardRangeSelect={enableRangeSelect}
          minRangeDuration={minRangeDuration && parseInt(minRangeDuration)}
          maxRangeDuration={maxRangeDuration && parseInt(maxRangeDuration)}
          headerWrapperStyle={styles.headerWrapperStyle}
        />

        <View style={styles.topSpacing}>
          <Text style={styles.text}>Selected (Start) date:  {formattedStartDate}</Text>
          {!!formattedEndDate &&
            <Text style={styles.text}>Selected End date:  {formattedEndDate}</Text>
          }
        </View>

        <View style={styles.topSpacing}>
          <Button onPress={this.clear} title="Clear Selection" />
        </View>

        <View style={styles.topSpacing}>
          <Text style={styles.text}>Range select:</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={enableRangeSelect ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={this.toggleEnableRange}
          value={enableRangeSelect}
        />

        {enableRangeSelect &&
          <View>
            <Text style={styles.text}>minRangeDuration:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={this.onMinRangeDuration}
              value={minRangeDuration || ""}
              keyboardType={"number-pad"}
            />

            <Text style={styles.text}>maxRangeDuration:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={this.onMaxRangeDuration}
              value={maxRangeDuration || ""}
              keyboardType={"number-pad"}
            />
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
    alignItems: 'center',
  },
  topSpacing: {
    marginTop: 20
  },
  text: {
    fontSize: 24,
  },
  textInput: {
    height: 40,
    fontSize: 24,
    borderColor: 'gray',
    borderWidth: 1,
  },
  headerWrapperStyle: {
    backgroundColor: '#ffbdab',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
  }
});
