import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { makeStyles } from "./makeStyles";
import { Utils } from "./Utils";
import HeaderControls from "./HeaderControls";
import Weekdays from "./Weekdays";
import DaysGridView from "./DaysGridView";
import Swiper from "./Swiper";
import moment from "moment";

const SWIPE_LEFT = "SWIPE_LEFT";
const SWIPE_RIGHT = "SWIPE_RIGHT";

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
      selectedStartDate: props.selectedStartDate || null,
      selectedEndDate: props.selectedEndDate || null,
      minDate: props.minDate && moment(props.minDate),
      maxDate: props.maxDate && moment(props.maxDate),
      styles: {},
      ...this.updateScaledStyles(props),
      ...this.updateMonthYear(props.initialDate),
      ...this.updateDayOfWeekStyles(props.initialDate),
    };
    this.updateScaledStyles = this.updateScaledStyles.bind(this);
    this.updateMonthYear = this.updateMonthYear.bind(this);
    this.updateDayOfWeekStyles = this.updateDayOfWeekStyles.bind(this);
    this.handleOnPressPrevious = this.handleOnPressPrevious.bind(this);
    this.handleOnPressNext = this.handleOnPressNext.bind(this);
    this.handleOnPressDay = this.handleOnPressDay.bind(this);
    this.onSwipe = this.onSwipe.bind(this);
    this.resetSelections = this.resetSelections.bind(this);
  }

  static defaultProps = {
    initialDate: moment(),
    scaleFactor: 375,
    enableSwipe: true,
    onDateChange: () => {
      console.log("onDateChange() not provided");
    },
    enableDateChange: true,
    headingLevel: 1,
    sundayColor: '#FFFFFF',
    dayOfWeekStyles: {},
    customDatesStyles: [],
    customDatesStylesPriority: "dayOfWeek",
  };

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
    let doStateUpdate = false;

    let newStyles = {};
    if (
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height
    ) {
      newStyles = this.updateScaledStyles(this.props);
      doStateUpdate = true;
    }

    let newMonthYear = {};
    if (!moment(prevProps.initialDate).isSame(this.props.initialDate, "day")) {
      newMonthYear = this.updateMonthYear(this.props.initialDate);
      doStateUpdate = true;
    }

    let selectedDateRanges = {};
    if (
      (this.props.selectedStartDate &&
        !moment(prevState.selectedStartDate).isSame(
          this.props.selectedStartDate,
          "day"
        )) ||
      (this.props.selectedEndDate &&
        !moment(prevState.selectedEndDate).isSame(
          this.props.selectedEndDate,
          "day"
        ))
    ) {
      const { selectedStartDate = null, selectedEndDate = null } = this.props;
      selectedDateRanges = {
        selectedStartDate,
        selectedEndDate
      };
      doStateUpdate = true;
    }

    let customDatesStyles = {};
    if (this.props.startFromMonday !== prevProps.startFromMonday ||
        this.props.dayOfWeekStyles !== prevProps.dayOfWeekStyles ||
        this.props.customDatesStylesPriority !== prevProps.customDatesStylesPriority ||
        this.props.customDatesStyles !== prevProps.customDatesStyles
    ) {
      customDatesStyles = this.updateDayOfWeekStyles(
        moment({year: this.state.currentYear, month: this.state.currentMonth}),
      );
      doStateUpdate = true;
    }

    let minDate = this.props.minDate && moment(this.props.minDate);
    let maxDate = this.props.maxDate && moment(this.props.maxDate);

    if (doStateUpdate) {
      this.setState({ ...newStyles, ...newMonthYear, ...selectedDateRanges,
                      ...customDatesStyles, minDate, maxDate });
    }
  }

  updateScaledStyles(props) {
    const {
      scaleFactor,
      selectedDayColor,
      selectedDayTextColor,
      todayBackgroundColor,
      width,
      height,
      dayShape
    } = props;

    // The styles in makeStyles are intially scaled to this width
    const containerWidth = width ? width : Dimensions.get("window").width;
    const containerHeight = height ? height : Dimensions.get("window").height;
    const initialScale =
      Math.min(containerWidth, containerHeight) / scaleFactor;
    return {
      styles: makeStyles(
        initialScale,
        selectedDayColor,
        selectedDayTextColor,
        todayBackgroundColor,
        dayShape
      )
    };
  }

  updateMonthYear(initialDate = this.props.initialDate) {
    return {
      currentMonth: parseInt(moment(initialDate).month()),
      currentYear: parseInt(moment(initialDate).year())
    };
  }

  handleOnPressDay(day) {
    const {
      currentYear,
      currentMonth,
      selectedStartDate,
      selectedEndDate
    } = this.state;

    const { allowRangeSelection, onDateChange, enableDateChange } = this.props;

    if (!enableDateChange) {
      return;
    }

    const date = moment({ year: currentYear, month: currentMonth, day, hour: 12 });

    if (
      allowRangeSelection &&
      selectedStartDate &&
      date.isSameOrAfter(selectedStartDate, "day") &&
      !selectedEndDate
    ) {
      this.setState({
        selectedEndDate: date
      });
      // propagate to parent date has changed
      onDateChange(date, Utils.END_DATE);
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null
      });
      // propagate to parent date has changed
      onDateChange(date, Utils.START_DATE);
    }
  }

  updateDayOfWeekStyles(currentDate) {
    const {
      startFromMonday,
      dayOfWeekStyles,
      customDatesStyles: propsCustomDatesStyles,
      customDatesStylesPriority
    } = this.props;

    let day = moment(currentDate).startOf('month');
    let customDayOfWeekStyles = [];
    do {
      let dayIndex = day.day();
      if (startFromMonday) {
        dayIndex = dayIndex - 1;
        if (dayIndex < 0) {
          dayIndex = 6; // This is Sunday.
        }
      }
      let currentDayStyle = dayOfWeekStyles[dayIndex];
      if (currentDayStyle) {
        customDayOfWeekStyles.push({
          date: day.clone(),
          textStyle: currentDayStyle,
        });
      }
    } while (day.add(1, 'day').isSame(currentDate, 'month'));

    let customDatesStyles = [];
    if (customDatesStylesPriority === "dayOfWeek") {
      customDatesStyles = [...customDayOfWeekStyles, ...propsCustomDatesStyles];
    }
    else {
      customDatesStyles = [...propsCustomDatesStyles, ...customDayOfWeekStyles];
    }

    return { customDatesStyles };
  };

  handleOnPressPrevious() {
    let { currentMonth, currentYear } = this.state;
    let previousMonth = currentMonth - 1;
    // if previousMonth is negative it means the current month is January,
    // so we have to go back to previous year and set the current month to December
    if (previousMonth < 0) {
      previousMonth = 11;
      currentYear--;
    }
    this.handleOnPressFinisher({year: currentYear, month: previousMonth});
  }

  handleOnPressNext() {
    let { currentMonth, currentYear } = this.state;
    let nextMonth = currentMonth + 1;
    // if nextMonth is greater than 11 it means the current month is December,
    // so we have to go forward to the next year and set the current month to January
    if (nextMonth > 11) {
      nextMonth = 0;
      currentYear++;
    }
    this.handleOnPressFinisher({year: currentYear, month: nextMonth});
  }

  handleOnPressFinisher({year, month}) {
    let dayOfWeekStyles = {};
    let currentMonthYear = moment({year, month});
    try {
      if (Object.entries(this.props.dayOfWeekStyles).length) {
        dayOfWeekStyles = this.updateDayOfWeekStyles(currentMonthYear);
      }
    }
    catch (error) {}

    this.setState({
      ...dayOfWeekStyles,
      currentMonth: parseInt(month),
      currentYear: parseInt(year)
    });

    this.props.onMonthChange && this.props.onMonthChange(currentMonthYear);
  }

  onSwipe(gestureName) {
    if (typeof this.props.onSwipe === "function") {
      this.props.onSwipe(gestureName);
      return;
    }
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
      selectedEndDate: null
    });
  }

  render() {
    const {
      currentMonth,
      currentYear,
      selectedStartDate,
      selectedEndDate,
      styles,
      customDatesStyles,
    } = this.state;

    const {
      allowRangeSelection,
      startFromMonday,
      initialDate,
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
      disabledDatesTextStyle,
      minRangeDuration,
      maxRangeDuration,
      swipeConfig,
      enableDateChange,
      restrictMonthNavigation,
      headingLevel,
      dayLabelsWrapper,
      dayOfWeekStyles,
      previousTitleStyle,
      nextTitleStyle,
    } = this.props;




    let _disabledDates = [];
    if (disabledDates) {
      if (Array.isArray(disabledDates)) {
        // Convert input date into timestamp
        disabledDates.map(date => {
          let thisDate = moment(date);
          thisDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          _disabledDates.push(thisDate.valueOf());
        });
      }
      else if (disabledDates instanceof Function) {
        _disabledDates = disabledDates;
      }
    }

    let minRangeDurationTime = [];

    if (allowRangeSelection && minRangeDuration) {
      if (Array.isArray(minRangeDuration)) {
        minRangeDuration.map(minRangeDuration => {
          let thisDate = moment(minRangeDuration.date);
          thisDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          minRangeDurationTime.push({
            date: thisDate.valueOf(),
            minDuration: minRangeDuration.minDuration
          });
        });
      } else {
        minRangeDurationTime = minRangeDuration;
      }
    }

    let maxRangeDurationTime = [];

    if (allowRangeSelection && maxRangeDuration) {
      if (Array.isArray(maxRangeDuration)) {
        maxRangeDuration.map(maxRangeDuration => {
          let thisDate = moment(maxRangeDuration.date);
          thisDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          maxRangeDurationTime.push({
            date: thisDate.valueOf(),
            maxDuration: maxRangeDuration.maxDuration
          });
        });
      } else {
        maxRangeDurationTime = maxRangeDuration;
      }
    }

    return (
      <Swiper
        onSwipe={direction => this.props.enableSwipe && this.onSwipe(direction)}
        config={{ ..._swipeConfig, ...swipeConfig }}
      >
        <View style={styles.calendar}>
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
            restrictMonthNavigation={restrictMonthNavigation}
            minDate={this.state.minDate}
            maxDate={this.state.maxDate}
            headingLevel={headingLevel}
            previousTitleStyle={previousTitleStyle}
            nextTitleStyle={nextTitleStyle}
          />
          <Weekdays
            styles={styles}
            startFromMonday={startFromMonday}
            weekdays={weekdays}
            textStyle={textStyle}
            dayLabelsWrapper={dayLabelsWrapper}
            dayOfWeekStyles={dayOfWeekStyles}
          />
          <DaysGridView
            enableDateChange={enableDateChange}
            month={currentMonth}
            year={currentYear}
            styles={styles}
            onPressDay={this.handleOnPressDay}
            disabledDates={_disabledDates}
            disabledDatesTextStyle={disabledDatesTextStyle}
            minRangeDuration={minRangeDurationTime}
            maxRangeDuration={maxRangeDurationTime}
            startFromMonday={startFromMonday}
            allowRangeSelection={allowRangeSelection}
            selectedStartDate={selectedStartDate && moment(selectedStartDate)}
            selectedEndDate={selectedEndDate && moment(selectedEndDate)}
            minDate={this.state.minDate}
            maxDate={this.state.maxDate}
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
