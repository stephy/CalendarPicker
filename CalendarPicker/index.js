import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { makeStyles } from './makeStyles';
import { Utils } from './Utils';
import HeaderControls from './HeaderControls';
import Weekdays from './Weekdays';
import DaysGridView from './DaysGridView';

// The styles in makeStyles are intially scaled to this width
const IPHONE6_WIDTH = 375;
const initialScale = Dimensions.get('window').width / IPHONE6_WIDTH ;
const styles = makeStyles(initialScale);

export default class CalendarPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialDate: null,
      currentMonth: null,
      currentYear: null,
      selectedStartDate: null,
      selectedEndDate: null,
      selectedDates: null,
      startFromMonday: false,
      allowRangeSelection: false,
    };
    this.handleOnPressPrevious = this.handleOnPressPrevious.bind(this);
    this.handleOnPressNext = this.handleOnPressNext.bind(this);
    this.handleOnPressDay = this.handleOnPressDay.bind(this);
  }

  componentWillMount() {
    const {
      initialDate,
      startFromMonday,
      allowRangeSelection
    } = this.props;

    const date = initialDate ? initialDate : new Date();

    this.setState({
      initialDate: date,
      currentMonth: parseInt(date.getMonth()),
      currentYear: parseInt(date.getFullYear()),
      startFromMonday,
      allowRangeSelection,
    });
  }

  handleOnPressDay(day, type) {
    const {
      currentYear,
      currentMonth,
      selectedStartDate,
      selectedEndDate,
    } = this.state;
    const date = new Date(currentYear, currentMonth, day);

    if (selectedStartDate && date > selectedStartDate && !selectedEndDate) {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  }

  handleOnPressPrevious() {
    const { currentMonth, currentYear } = this.state;
    const previousMonth = currentMonth - 1;
    // if previousMonth is negative it means the current month is January,
    // so we have to go back to previous year and set the current month to December
    if (previousMonth < 0) {
      this.setState({
        currentMonth: parseInt(11), // setting month to December
        currentYear: parseInt(currentYear) - 1, // decrement year
      });
    } else {
      this.setState({
        currentMonth: parseInt(previousMonth),
        currentYear: parseInt(currentYear),
      });
    }
  }

  handleOnPressNext() {
    const { currentMonth, currentYear } = this.state;
    const nextMonth = currentMonth + 1;
    // if nextMonth is greater than 11 it means the current month is December,
    // so we have to go forward to the next year and set the current month to January
    if (nextMonth > 11) {
      this.setState({
        currentMonth: parseInt(0), // setting month to January
        currentYear: parseInt(currentYear) + 1, // increment year
      });
    } else {
      this.setState({
        currentMonth: parseInt(nextMonth),
        currentYear: parseInt(currentYear),
      });
    }
  }

  render() {
    const {
      initialDate,
      currentMonth,
      currentYear,
      selectedStartDate,
      selectedEndDate,
      allowRangeSelection,
      startFromMonday
    } = this.state;

    console.log(this.state);

    return (
      <View syles={styles.calendar}>
        <HeaderControls
          styles={styles}
          currentMonth={currentMonth}
          currentYear={currentYear}
          initialDate={initialDate}
          onPressPrevious={this.handleOnPressPrevious}
          onPressNext={this.handleOnPressNext}
        />
        <Weekdays
          styles={styles}
          startFromMonday={startFromMonday}
        />
        <DaysGridView
          month={currentMonth}
          year={currentYear}
          styles={styles}
          onPressDay={this.handleOnPressDay}
          startFromMonday={startFromMonday}
          allowRangeSelection={allowRangeSelection}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
        />
      </View>
    );
  }
}
