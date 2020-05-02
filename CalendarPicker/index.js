import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { makeStyles } from './makeStyles';
import { Utils } from './Utils';
import HeaderControls from './HeaderControls';
import Weekdays from './Weekdays';
import DaysGridView from './DaysGridView';
import MonthSelector from './MonthSelector';
import YearSelector from './YearSelector';
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
      currentView: 'days',
      selectedStartDate: props.selectedStartDate && moment(props.selectedStartDate),
      selectedEndDate: props.selectedEndDate && moment(props.selectedEndDate),
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
    this.handleOnPressMonth = this.handleOnPressMonth.bind(this);
    this.handleOnPressYear = this.handleOnPressYear.bind(this);
    this.handleOnSelectMonth = this.handleOnSelectMonth.bind(this);
    this.handleOnSelectYear = this.handleOnSelectYear.bind(this);
    this.onSwipe = this.onSwipe.bind(this);
    this.resetSelections = this.resetSelections.bind(this);
  }

  static defaultProps = {
    initialDate: moment(),
    scaleFactor: 375,
    enableSwipe: true,
    onDateChange: () => {
      console.log('onDateChange() not provided');
    },
    enableDateChange: true,
    headingLevel: 1,
    sundayColor: '#FFFFFF',
    dayOfWeekStyles: {},
    customDatesStyles: [],
    customDatesStylesPriority: 'dayOfWeek',
    previousTitle: 'Previous',
    nextTitle: 'Next',
    selectMonthTitle: 'Select Month',
    selectYearTitle: 'Select Year',
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
    if (!moment(prevProps.initialDate).isSame(this.props.initialDate, 'day')) {
      newMonthYear = this.updateMonthYear(this.props.initialDate);
      doStateUpdate = true;
    }

    let selectedDateRanges = {};
    const { selectedStartDate, selectedEndDate } = this.props;
    if ((selectedStartDate && prevState.selectedStartDate &&
        prevState.selectedStartDate.isSame(selectedStartDate, 'day')) ||
      (selectedEndDate && prevState.selectedEndDate &&
        prevState.selectedEndDate.isSame(this.props.selectedEndDate, 'day'))
    ) {
      selectedDateRanges = {
        selectedStartDate: selectedStartDate && moment(selectedStartDate),
        selectedEndDate: selectedEndDate && moment(selectedEndDate)
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
    const containerWidth = width ? width : Dimensions.get('window').width;
    const containerHeight = height ? height : Dimensions.get('window').height;
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
      allowBackwardRangeSelect,
      enableDateChange,
      onDateChange,
    } = this.props;

    if (!enableDateChange) {
      return;
    }

    const date = moment({ year: currentYear, month: currentMonth, day, hour: 12 });

    if (allowRangeSelection && selectedStartDate && !selectedEndDate) {
      if (date.isSameOrAfter(selectedStartDate, 'day')) {
        this.setState({
          selectedEndDate: date
        });
        // propagate to parent date has changed
        onDateChange(date, Utils.END_DATE);
      }
      else if (allowBackwardRangeSelect) { // date is before selectedStartDate
        // Flip dates so that start is always before end.
        const endDate = selectedStartDate.clone();
        this.setState({
          selectedStartDate: date,
          selectedEndDate: endDate
        });
        onDateChange(date, Utils.START_DATE);
        onDateChange(endDate, Utils.END_DATE);
      }
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
    if (customDatesStylesPriority === 'dayOfWeek') {
      customDatesStyles = [...customDayOfWeekStyles, ...propsCustomDatesStyles];
    }
    else {
      customDatesStyles = [...propsCustomDatesStyles, ...customDayOfWeekStyles];
    }

    return { customDatesStyles };
  }

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
    catch (error) {
      console.log('dayOfWeekStyles error');
    }

    this.setState({
      ...dayOfWeekStyles,
      currentMonth: parseInt(month),
      currentYear: parseInt(year)
    });

    this.props.onMonthChange && this.props.onMonthChange(currentMonthYear);
  }

  handleOnPressYear() {
    this.setState({
      currentView: 'years'
    });
  }

  handleOnPressMonth() {
    this.setState({
      currentView: 'months'
    });
  }

  handleOnSelectMonth(month) {
    if (!this.props.enableDateChange) {
      return;
    }
    this.setState({
      currentMonth: parseInt(month),
      currentView: 'days'
    });
  }

  handleOnSelectYear(year) {
    if (!this.props.enableDateChange) {
      return;
    }

    // Guard against navigating to months beyond min/max dates.
    let currentMonth = this.state.currentMonth;
    if (this.state.maxDate) {
      const maxDateMonth = this.state.maxDate.month();
      const maxDateYear = this.state.maxDate.year();
      if (year === maxDateYear && currentMonth > maxDateMonth) {
        currentMonth = maxDateMonth;
      }
    }
    if (this.state.minDate) {
      const minDateMonth = this.state.minDate.month();
      const minDateYear = this.state.minDate.year();
      if (year === minDateYear && currentMonth < minDateMonth) {
        currentMonth = minDateMonth;
      }
    }

    this.setState({
      currentYear: parseInt(year),
      currentMonth,
      currentView: 'days'
    });
  }

  onSwipe(gestureName) {
    if (typeof this.props.onSwipe === 'function') {
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
      minDate,
      maxDate,
      selectedStartDate,
      selectedEndDate,
      styles,
      customDatesStyles,
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
      previousTitleStyle,
      nextTitleStyle,
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
      selectMonthTitle,
      selectYearTitle,
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

    let content;
    switch (this.state.currentView) {
    case 'months':
      content = (
        <MonthSelector
          styles={styles}
          textStyle={textStyle}
          title={selectMonthTitle}
          currentYear={currentYear}
          months={months}
          minDate={minDate}
          maxDate={maxDate}
          onSelectMonth={this.handleOnSelectMonth}
          headingLevel={headingLevel}
          disabledDates={disabledDates}
        />
      );
      break;
    case 'years':
      content = (
        <YearSelector
          styles={styles}
          textStyle={textStyle}
          title={selectYearTitle}
          initialDate={moment(initialDate)}
          currentYear={currentYear}
          minDate={minDate}
          maxDate={maxDate}
          restrictNavigation={restrictMonthNavigation}
          previousTitle={previousTitle}
          nextTitle={nextTitle}
          previousTitleStyle={previousTitleStyle}
          nextTitleStyle={nextTitleStyle}
          onSelectYear={this.handleOnSelectYear}
          headingLevel={headingLevel}
          disabledDates={disabledDates}
        />
      );
      break;
    default:
      content = (
        <View>
          <HeaderControls
            styles={styles}
            currentMonth={currentMonth}
            currentYear={currentYear}
            initialDate={moment(initialDate)}
            onPressPrevious={this.handleOnPressPrevious}
            onPressNext={this.handleOnPressNext}
            onPressMonth={this.handleOnPressMonth}
            onPressYear={this.handleOnPressYear}
            months={months}
            previousTitle={previousTitle}
            nextTitle={nextTitle}
            textStyle={textStyle}
            restrictMonthNavigation={restrictMonthNavigation}
            minDate={minDate}
            maxDate={maxDate}
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
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            minDate={minDate}
            maxDate={maxDate}
            textStyle={textStyle}
            todayTextStyle={todayTextStyle}
            selectedDayStyle={selectedDayStyle}
            selectedRangeStartStyle={selectedRangeStartStyle}
            selectedRangeStyle={selectedRangeStyle}
            selectedRangeEndStyle={selectedRangeEndStyle}
            customDatesStyles={customDatesStyles}
          />
        </View>
      );
    }

    return (
      <Swiper
        onSwipe={direction => this.props.enableSwipe && this.onSwipe(direction)}
        config={{ ..._swipeConfig, ...swipeConfig }}
      >
        <View styles={styles.calendar}>
          { content }
        </View>
      </Swiper>
    );
  }
}
