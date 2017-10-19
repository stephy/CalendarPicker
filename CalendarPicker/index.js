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
import Swiper from './Swiper';

const SWIPE_LEFT = 'SWIPE_LEFT';
const SWIPE_RIGHT = 'SWIPE_RIGHT';

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};

export default class CalendarPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: null,
      currentYear: null,
      selectedStartDate: null,
      selectedEndDate: null,
      styles: {},
    };
    this.updateScaledStyles = this.updateScaledStyles.bind(this);
    this.updateMonthYear = this.updateMonthYear.bind(this);
    this.handleOnPressPrevious = this.handleOnPressPrevious.bind(this);
    this.handleOnPressNext = this.handleOnPressNext.bind(this);
    this.handleOnPressDay = this.handleOnPressDay.bind(this);
    this.onSwipe = this.onSwipe.bind(this);
  }

  static defaultProps = {
    initialDate: new Date(),
    scaleFactor: 375,
  }

  componentWillMount() {
    this.setState({...this.updateScaledStyles(this.props), ...this.updateMonthYear(this.props)});
  }

  componentWillReceiveProps(nextProps) {
    let newStyles = {};
    if (nextProps.width !== this.props.width ||
        nextProps.height !== this.props.height)
    {
      newStyles = this.updateScaledStyles(nextProps);
    }

    let newMonthYear = {}
    if (nextProps.initialDate.getTime() !== this.props.initialDate.getTime()) {
      this.updateMonthYear(nextProps, {});
    }

    this.setState({...newStyles, ...newMonthYear});
  }

  updateScaledStyles(props) {
    const {
      scaleFactor,
      selectedDayColor,
      selectedDayTextColor,
      todayBackgroundColor,
      selectedStartDate,
      selectedEndDate,
      disabledDates,
      disabledRanges,
      width, height
    } = this.props;

    // The styles in makeStyles are intially scaled to this width
    const containerWidth = width ? width : Dimensions.get('window').width;
    const containerHeight = height ? height : Dimensions.get('window').height;
    const initialScale = Math.min(containerWidth, containerHeight) / scaleFactor;
    const styles = makeStyles(initialScale, selectedDayColor, selectedDayTextColor, todayBackgroundColor);

    // Convert input date into timestamp
    if (disabledDates && Array.isArray(disabledDates)) {
      disabledDates.map(function(date, index, disabledDates){
        date.setHours(0,0,0,0);
        disabledDates[index] = date.getTime();
      });
    }

    if (disabledRanges && Array.isArray(disabledRanges) && disabledRanges.length > 0) {
      disabledRanges.map((range, index, disabledRanges) => {
        range.start_date.setHours(0,0,0,0)
        range.end_date.setHours(0,0,0,0)
        disabledRanges[index] = {
          start_date: range.start_date.getTime(),
          end_date: range.end_date.getTime()
        }
      })
    }

    this.updateMonthYear(this.props, {styles});

    this.setState({
      selectedStartDate: selectedStartDate ? selectedStartDate : null,
      selectedEndDate: selectedEndDate ? selectedEndDate : null
    })

    return { styles }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialDate.getTime() !== this.props.initialDate.getTime()) {
      this.updateMonthYear(nextProps, {});
    }
  }

  updateMonthYear(props) {
    return {
      currentMonth: parseInt(props.initialDate.getMonth()),
      currentYear: parseInt(props.initialDate.getFullYear()),
    };
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

  onSwipe(gestureName) {
    switch (gestureName) {
      case SWIPE_LEFT:
        this.handleOnPressNext();
        break;
      case SWIPE_RIGHT:
        this.handleOnPressPrevious();
        break;
    }
  }

  render() {
    const {
      currentMonth,
      currentYear,
      selectedStartDate,
      selectedEndDate,
      styles,
    } = this.state;

    const {
      allowRangeSelection,
      startFromMonday,
      initialDate,
      minDate,
      maxDate,
      weekdays,
      months,
      disabledDates,
      disabledRanges,
      previousTitle,
      nextTitle,
      textStyle,
      monthYearTitleStyle
    } = this.props;

    const titleStyle = monthYearTitleStyle || {}

    return (
      <Swiper
        onSwipe={(direction) => this.onSwipe(direction)}
        config={swipeConfig}
      >
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
            monthYearTitleStyle={titleStyle}
            nextTitle={nextTitle}
            textStyle={textStyle}
          />
          <Weekdays
            styles={styles}
            startFromMonday={startFromMonday}
            weekdays={weekdays}
            textStyle={textStyle}
          />
          <DaysGridView
            month={currentMonth}
            year={currentYear}
            styles={styles}
            onPressDay={this.handleOnPressDay}
            disabledDates={disabledDates}
            disabledRanges={disabledRanges}
            startFromMonday={startFromMonday}
            allowRangeSelection={allowRangeSelection}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            minDate={minDate && minDate.setHours(0,0,0,0)}
            maxDate={maxDate && maxDate.setHours(0,0,0,0)}
            textStyle={textStyle}
          />
        </View>
      </Swiper>
    );
  }
}
