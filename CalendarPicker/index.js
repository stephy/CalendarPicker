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
      defaultCustomDatesStyles: [],
      ...this.updateScaledStyles(props),
      ...this.updateMonthYear(props.initialDate)
    };
    this.updateScaledStyles = this.updateScaledStyles.bind(this);
    this.updateMonthYear = this.updateMonthYear.bind(this);
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
  };

  componentDidMount() {
    this.updateDayOfWeekStyles(moment());
  }

  updateDayOfWeekStyles = currentDate => {
    const {startFromMonday, dayOfWeekStyles} = this.props;
    let day = currentDate.clone().startOf('month');

    let customDatesStyles = [];
    do {
      // console.log('Date: ' + day.date());
      let dayIndex = day.day();
      if (startFromMonday) {
        dayIndex = dayIndex - 1;
        if (dayIndex < 0) {
          dayIndex = 6; // This is Sunday.
        }
      }
      let currentDayStyle = dayOfWeekStyles[dayIndex];
      if (currentDayStyle) {
        customDatesStyles.push({
          date: day.clone(),
          textStyle: currentDayStyle,
        });
      }
    } while (day.add(1, 'day').isSame(currentDate, 'month'));
    this.setState({defaultCustomDatesStyles: customDatesStyles});
  };

  componentDidUpdate(prevProps, prevState) {
    let newStyles = {};
    let doStateUpdate = false;
    let minDate, maxDate;

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

    minDate = this.props.minDate && moment(this.props.minDate);
    maxDate = this.props.maxDate && moment(this.props.maxDate);

    if (doStateUpdate) {
      this.setState({ ...newStyles, ...newMonthYear, ...selectedDateRanges, minDate, maxDate });
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

    const {
      allowRangeSelection,
      onDateChange,
      enableDateChange,
      allowBackwardRangeSelect,
      maxRangeDuration,
    } = this.props;

    if (!enableDateChange) {
      return;
    }

    const date = moment({ year: currentYear, month: currentMonth, day, hour: 12 }),
      startDate = selectedStartDate && moment(selectedStartDate),
      endDate = selectedEndDate && moment(selectedEndDate);

    if (allowRangeSelection && startDate && !endDate) {
      if (date.isSameOrAfter(startDate, 'day')) {
        this.setState({
          selectedEndDate: date,
        });
        // propagate to parent date has changed
        onDateChange(date, Utils.END_DATE);
        if (
          maxRangeDuration &&
          !isNaN(maxRangeDuration) &&
          date.diff(startDate, 'days') > maxRangeDuration
        ) {
          const newStartDate = date.clone().subtract(maxRangeDuration, 'days');
          this.setState({
            selectedStartDate: newStartDate,
          });
          // propagate to parent date has changed
          onDateChange(newStartDate, Utils.START_DATE);
        }
      } else if (allowBackwardRangeSelect) {
        if (
          maxRangeDuration &&
          !isNaN(maxRangeDuration) &&
          startDate.diff(date, 'days') > maxRangeDuration
        ) {
          const newEndDate = date.clone().add(maxRangeDuration, 'days');
          this.setState({
            selectedStartDate: date,
            selectedEndDate: newEndDate,
          });
          // propagate to parent date has changed
          onDateChange(date, Utils.START_DATE);
          onDateChange(newEndDate, Utils.END_DATE);
        } else {
          this.setState({
            selectedStartDate: date,
            selectedEndDate: startDate,
          });
          // propagate to parent date has changed
          onDateChange(date, Utils.START_DATE);
          onDateChange(startDate, Utils.END_DATE);
        }
      } else {
        this.setState({
          selectedStartDate: date,
          selectedEndDate: null,
        });
        // propagate to parent date has changed
        onDateChange(date, Utils.START_DATE);
      }
    } else if (allowRangeSelection && startDate) {
      if (endDate.diff(date, 'days') > maxRangeDuration) {
        if (date.isBefore(endDate)) {
          const newEndDate = date.clone().add(maxRangeDuration, 'days');
          this.setState({
            selectedStartDate: date,
            selectedEndDate: newEndDate,
          });
          // propagate to parent date has changed
          onDateChange(date, Utils.START_DATE);
          onDateChange(newEndDate, Utils.END_DATE);
        } else if (allowBackwardRangeSelect) {
          const newStartDate = date.clone().subtract(maxRangeDuration, 'days');
          this.setState({
            selectedStartDate: newStartDate,
            selectedEndDate: date,
          });
          // propagate to parent date has changed
          onDateChange(newStartDate, Utils.START_DATE);
          onDateChange(date, Utils.END_DATE);
        } else {
          this.setState({
            selectedStartDate: date,
            selectedEndDate: null,
          });
          // propagate to parent date has changed
          onDateChange(date, Utils.START_DATE);
          onDateChange(null, Utils.END_DATE);
        }
      } else {
        this.setState({
          selectedStartDate: date,
          selectedEndDate: null,
        });
        // propagate to parent date has changed
        onDateChange(date, Utils.START_DATE);
        onDateChange(null, Utils.END_DATE);
      }
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
      currentYear -= 1; // decrement year
      this.setState({
        currentMonth: parseInt(previousMonth), // setting month to December
        currentYear: parseInt(currentYear)
      });
    } else {
      this.setState({
        currentMonth: parseInt(previousMonth),
        currentYear: parseInt(currentYear)
      });
    }
    try {
      if (Object.entries(this.props.dayOfWeekStyles).length) {
        this.updateDayOfWeekStyles(
          moment({year: currentYear, month: previousMonth}),
        );
      }
    } catch (error) {}
    this.props.onMonthChange &&
      this.props.onMonthChange(
        moment({ year: currentYear, month: previousMonth })
      );
  }

  handleOnPressNext() {
    let { currentMonth, currentYear } = this.state;
    let nextMonth = currentMonth + 1;
    // if nextMonth is greater than 11 it means the current month is December,
    // so we have to go forward to the next year and set the current month to January
    if (nextMonth > 11) {
      nextMonth = 0;
      currentYear += 1; // increment year
      this.setState({
        currentMonth: parseInt(nextMonth), // setting month to January
        currentYear: parseInt(currentYear)
      });
    } else {
      this.setState({
        currentMonth: parseInt(nextMonth),
        currentYear: parseInt(currentYear)
      });
    }
    try {
      if (Object.entries(this.props.dayOfWeekStyles).length > 0) {
        this.updateDayOfWeekStyles(moment({year: currentYear, month: nextMonth}));
      }
    } catch (error) {}
    this.props.onMonthChange &&
      this.props.onMonthChange(moment({ year: currentYear, month: nextMonth }));
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
      defaultCustomDatesStyles,
    } = this.state;

    const {
      allowRangeSelection,
      allowBackwardRangeSelect,
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
      customDatesStyles,
      enableDateChange,
      restrictMonthNavigation,
      headingLevel,
      dayLabelsWrapper,
      dayOfWeekStyles,
      previousTitleStyle,
      nextTitleStyle,
    } = this.props;

    let _disabledDates = [];
    let tempCustomDatesStyles = customDatesStyles;
    if (Object.entries(dayOfWeekStyles).length > 0) {
      tempCustomDatesStyles = customDatesStyles
        ? customDatesStyles
        : defaultCustomDatesStyles;
    }
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
            allowBackwardRangeSelect={allowBackwardRangeSelect}
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
            customDatesStyles={tempCustomDatesStyles}
          />
        </View>
      </Swiper>
    );
  }
}
