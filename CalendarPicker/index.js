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
import moment from 'moment';

const SWIPE_LEFT = 'SWIPE_LEFT';
const SWIPE_RIGHT = 'SWIPE_RIGHT';

const _swipeConfig = {
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
    initialDate: moment(),
    scaleFactor: 375,
    enableSwipe: true,
  }

  componentWillMount() {
    this.setState({...this.updateScaledStyles(this.props), ...this.updateMonthYear(this.props.initialDate)});
  }

  componentWillReceiveProps(nextProps) {
    let newStyles = {};
    let doStateUpdate = false;

    if (nextProps.width !== this.props.width ||
        nextProps.height !== this.props.height)
    {
      newStyles = this.updateScaledStyles(nextProps);
      doStateUpdate = true;
    }

    let newMonthYear = {};
    if (!moment(nextProps.initialDate).isSame(this.props.initialDate, 'day')) {
      newMonthYear = this.updateMonthYear(nextProps.initialDate);
      doStateUpdate = true;
    }

    if (doStateUpdate) {
      this.setState({...newStyles, ...newMonthYear});
    }
  }

  updateScaledStyles(props) {
    const {
      scaleFactor,
      selectedDayColor,
      selectedDayTextColor,
      todayBackgroundColor,
      selectedStartDate,
      selectedEndDate,
      width, height,
    } = props;

    // The styles in makeStyles are intially scaled to this width
    const containerWidth = width ? width : Dimensions.get('window').width;
    const containerHeight = height ? height : Dimensions.get('window').height;
    const initialScale = Math.min(containerWidth, containerHeight) / scaleFactor;
    this.setState({selectedStartDate, selectedEndDate});
    return {styles: makeStyles(initialScale, selectedDayColor, selectedDayTextColor, todayBackgroundColor)};
  }

  updateMonthYear(initialDate = this.props.initialDate) {
    return {
      currentMonth: parseInt(moment(initialDate).month()),
      currentYear: parseInt(moment(initialDate).year()),
    };
  }

  handleOnPressDay(day) {
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

    const date = moment({year: currentYear, month: currentMonth, day});

    if (allowRangeSelection &&
        selectedStartDate &&
        date.isSameOrAfter(selectedStartDate) &&
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
    let { currentMonth, currentYear } = this.state;
    let previousMonth = currentMonth - 1;
    // if previousMonth is negative it means the current month is January,
    // so we have to go back to previous year and set the current month to December
    if (previousMonth < 0) {
      previousMonth = 11;
      currentYear -= 1;  // decrement year
      this.setState({
        currentMonth: parseInt(previousMonth), // setting month to December
        currentYear: parseInt(currentYear),
      });
    } else {
      this.setState({
        currentMonth: parseInt(previousMonth),
        currentYear: parseInt(currentYear),
      });
    }
    this.props.onMonthChange && this.props.onMonthChange(moment({year: currentYear, month: previousMonth}));
  }

  handleOnPressNext() {
    let { currentMonth, currentYear } = this.state;
    let nextMonth = currentMonth + 1;
    // if nextMonth is greater than 11 it means the current month is December,
    // so we have to go forward to the next year and set the current month to January
    if (nextMonth > 11) {
      nextMonth = 0;
      currentYear += 1;  // increment year
      this.setState({
        currentMonth: parseInt(nextMonth), // setting month to January
        currentYear: parseInt(currentYear),
      });
    } else {
      this.setState({
        currentMonth: parseInt(nextMonth),
        currentYear: parseInt(currentYear),
      });
    }
    this.props.onMonthChange && this.props.onMonthChange(moment({year: currentYear, month: nextMonth}));
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

  resetSelections() {
    this.setState({
      selectedStartDate: null,
      selectedEndDate: null,
    });
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
      previousTitle,
      nextTitle,
      textStyle,
      todayTextStyle,
      selectedDayStyle,
      selectedRangeStartStyle,
      selectedRangeStyle,
      selectedRangeEndStyle,
      disabledDates,
      minRangeDuration,
      maxRangeDuration,
      swipeConfig,
      customDatesStyles,
    } = this.props;

    let disabledDatesTime = [];

    // Convert input date into timestamp
    if (disabledDates && Array.isArray(disabledDates)) {
      disabledDates.map((date)=>{
        let thisDate = moment(date);
        thisDate.set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0});
        disabledDatesTime.push(thisDate.valueOf());
      });
    }

    let minRangeDurationTime = [];

    if (allowRangeSelection && minRangeDuration) {
      if (Array.isArray(minRangeDuration)) {
        minRangeDuration.map((minRangeDuration)=>{
          let thisDate = moment(minRangeDuration.date);
          thisDate.set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0});
          minRangeDurationTime.push({date: thisDate.valueOf(), minDuration: minRangeDuration.minDuration});
        });
      } else {
        minRangeDurationTime = minRangeDuration
      }
    }

    let maxRangeDurationTime = [];

    if (allowRangeSelection && maxRangeDuration) {
      if (Array.isArray(maxRangeDuration)) {
        maxRangeDuration.map((maxRangeDuration)=>{
          let thisDate = moment(maxRangeDuration.date);
          thisDate.set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0});
          maxRangeDurationTime.push({date: thisDate.valueOf(), maxDuration: maxRangeDuration.maxDuration});
        });
      } else {
        maxRangeDurationTime = maxRangeDuration
      }
    }

    return (
      <Swiper
        onSwipe={direction => this.props.enableSwipe && this.onSwipe(direction)}
        config={{..._swipeConfig, ...swipeConfig}}
      >
        <View syles={styles.calendar}>
          <HeaderControls
            styles={styles}
            currentMonth={currentMonth}
            currentYear={currentYear}
            initialDate={moment(initialDate)}
            onPressPrevious={this.handleOnPressPrevious}
            onPressNext={this.handleOnPressNext}
            months={months}
            previousTitle={previousTitle}
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
            disabledDates={disabledDatesTime}
            minRangeDuration={minRangeDurationTime}
            maxRangeDuration={maxRangeDurationTime}
            startFromMonday={startFromMonday}
            allowRangeSelection={allowRangeSelection}
            selectedStartDate={selectedStartDate && moment(selectedStartDate)}
            selectedEndDate={selectedEndDate && moment(selectedEndDate)}
            minDate={minDate && moment(minDate)}
            maxDate={maxDate && moment(maxDate)}
            textStyle={textStyle}
            todayTextStyle={todayTextStyle}
            selectedDayStyle={selectedDayStyle}
            selectedRangeStartStyle={selectedRangeStartStyle}
            selectedRangeStyle={selectedRangeStyle}
            selectedRangeEndStyle={selectedRangeEndStyle}
            customDatesStyles={customDatesStyles}
          />
        </View>
      </Swiper>
    );
  }
}
