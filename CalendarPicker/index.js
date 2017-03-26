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

export default class CalendarPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialDate: null,
      currentMonth: null,
      currentYear: null,
      selectedStartDate: null,
      selectedEndDate: null,
      styles: {},
    };
    this.handleOnPressPrevious = this.handleOnPressPrevious.bind(this);
    this.handleOnPressNext = this.handleOnPressNext.bind(this);
    this.handleOnPressDay = this.handleOnPressDay.bind(this);
  }

  componentWillMount() {
    const {
      scaleFactor,
      initialDate,
      selectedDayColor,
      selectedDayTextColor,
      todayBackgroundColor,
    } = this.props;

    // The styles in makeStyles are intially scaled to this width
    const deviceWidth = Dimensions.get('window').width;
    const initialScale = scaleFactor? deviceWidth / scaleFactor : deviceWidth / 375;
    const styles = makeStyles(initialScale, selectedDayColor, selectedDayTextColor, todayBackgroundColor);
    const date = initialDate ? initialDate : new Date();

    this.setState({
      initialDate: date,
      currentMonth: parseInt(date.getMonth()),
      currentYear: parseInt(date.getFullYear()),
      styles,
    });
  }

  handleOnPressDay(day, type) {
    const {
      currentYear,
      currentMonth,
      selectedStartDate,
      selectedEndDate,
    } = this.state;

    const {
      allowRangeSelection,
      onDateChange,
    } = this.props;

    const date = new Date(currentYear, currentMonth, day);

    if (allowRangeSelection &&
        selectedStartDate &&
        date >= selectedStartDate &&
        !selectedEndDate) {
      this.setState({
        selectedEndDate: date,
      });
      // propagate to parent date has changed
      onDateChange(date, Utils.END_DATE);
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
      // propagate to parent date has changed
      onDateChange(date, Utils.START_DATE);
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
      styles,
    } = this.state;

    const {
      allowRangeSelection,
      startFromMonday,
      minDate,
      maxDate,
      weekdays,
      months,
      previousTitle,
      nextTitle,
    } = this.props;

    return (
      <View syles={styles.calendar}>
        <HeaderControls
          styles={styles}
          currentMonth={currentMonth}
          currentYear={currentYear}
          initialDate={initialDate}
          onPressPrevious={this.handleOnPressPrevious}
          onPressNext={this.handleOnPressNext}
          months={months}
          previousTitle={previousTitle}
          nextTitle={nextTitle}
        />
        <Weekdays
          styles={styles}
          startFromMonday={startFromMonday}
          weekdays={weekdays}
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
          minDate={minDate.setHours(0,0,0,0)}
          maxDate={maxDate.setHours(0,0,0,0)}
        />
      </View>
    );
  }
}
