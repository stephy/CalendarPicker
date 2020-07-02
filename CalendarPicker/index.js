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
      ...this.updateDisabledDates(props.disabledDates),
      ...this.updateMinMaxRanges(props.minRangeDuration, props.maxRangeDuration),
    };
    this.updateScaledStyles = this.updateScaledStyles.bind(this);
    this.updateMonthYear = this.updateMonthYear.bind(this);
    this.updateDisabledDates = this.updateDisabledDates.bind(this);
    this.updateMinMaxRanges = this.updateMinMaxRanges.bind(this);
    this.updateDayOfWeekStyles = this.updateDayOfWeekStyles.bind(this);
    this.handleOnPressPrevious = this.handleOnPressPrevious.bind(this);
    this.handleOnPressNext = this.handleOnPressNext.bind(this);
    this.handleOnPressDay = this.handleOnPressDay.bind(this);
    this.handleOnPressMonth = this.handleOnPressMonth.bind(this);
    this.handleOnPressYear = this.handleOnPressYear.bind(this);
    this.handleOnSelectMonthYear = this.handleOnSelectMonthYear.bind(this);
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
    customDatesStyles: [],
    customDatesStylesPriority: 'dayOfWeek', // ToDo: Deprecated. Remove.
    dayOfWeekStyles: {}, // ToDo: Deprecated. Remove.
    previousTitle: 'Previous',
    nextTitle: 'Next',
    selectMonthTitle: 'Select Month',
    selectYearTitle: 'Select Year',
  };

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
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
    if (selectedStartDate !== prevProps.selectedStartDate ||
        selectedEndDate !== prevProps.selectedEndDate
    ) {
      selectedDateRanges = {
        selectedStartDate: selectedStartDate && moment(selectedStartDate),
        selectedEndDate: selectedEndDate && moment(selectedEndDate)
      };
      doStateUpdate = true;
    }

    // ----------------------------------------------------------------
    // ToDo: Deprecated. Remove entire block
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
    // ----------------------------------------------------------------

    let disabledDates = {};
    if (prevProps.disabledDates !== this.props.disabledDates) {
      disabledDates = this.updateDisabledDates(this.props.disabledDates);
      doStateUpdate = true;
    }

    let rangeDurations = {};
    if (prevProps.minRangeDuration !== this.props.minRangeDuration ||
        prevProps.maxRangeDuration !== this.props.maxRangeDuration
    ) {
      const {minRangeDuration, maxRangeDuration} = this.props;
      rangeDurations = this.updateMinMaxRanges(minRangeDuration, maxRangeDuration);
      doStateUpdate = true;
    }

    let minDate = this.props.minDate && moment(this.props.minDate);
    let maxDate = this.props.maxDate && moment(this.props.maxDate);

    if (doStateUpdate) {
      this.setState({ ...newStyles, ...newMonthYear, ...selectedDateRanges,
        ...customDatesStyles, ...disabledDates, ...rangeDurations,
        minDate, maxDate });
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
    return {
      styles: makeStyles({
        containerWidth,
        containerHeight,
        scaleFactor,
        selectedDayColor,
        selectedDayTextColor,
        todayBackgroundColor,
        dayShape
      })
    };
  }

  updateMonthYear(initialDate = this.props.initialDate) {
    return {
      currentMonth: parseInt(moment(initialDate).month()),
      currentYear: parseInt(moment(initialDate).year())
    };
  }

  updateDisabledDates(_disabledDates = []) {
    let disabledDates = [];
    if (_disabledDates) {
      if (Array.isArray(_disabledDates)) {
        // Convert input date into timestamp
        _disabledDates.map(date => {
          let thisDate = moment(date);
          thisDate.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
          disabledDates.push(thisDate.valueOf());
        });
      }
      else if (_disabledDates instanceof Function) {
        disabledDates = _disabledDates;
      }
    }
    return { disabledDates };
  }

  updateMinMaxRanges(_minRangeDuration, _maxRangeDuration) {
    let minRangeDuration = [];
    let maxRangeDuration = [];

    if (_minRangeDuration) {
      if (Array.isArray(_minRangeDuration)) {
        _minRangeDuration.map(mrd => {
          let thisDate = moment(mrd.date);
          thisDate.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
          minRangeDuration.push({
            date: thisDate.valueOf(),
            minDuration: mrd.minDuration
          });
        });
      } else {
        minRangeDuration = _minRangeDuration;
      }
    }

    if (_maxRangeDuration) {
      if (Array.isArray(_maxRangeDuration)) {
        _maxRangeDuration.map(mrd => {
          let thisDate = moment(mrd.date);
          thisDate.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
          maxRangeDuration.push({
            date: thisDate.valueOf(),
            maxDuration: mrd.maxDuration
          });
        });
      } else {
        maxRangeDuration = _maxRangeDuration;
      }
    }
    return {minRangeDuration, maxRangeDuration};
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
        // Sync start date with parent
        onDateChange(date, Utils.END_DATE);
      }
      else if (allowBackwardRangeSelect) { // date is before selectedStartDate
        // Flip dates so that start is always before end.
        const endDate = selectedStartDate.clone();
        this.setState({
          selectedStartDate: date,
          selectedEndDate: endDate
        }, () => {
          // Sync both start and end dates with parent *after* state update.
          onDateChange(this.state.selectedStartDate, Utils.START_DATE);
          onDateChange(this.state.selectedEndDate, Utils.END_DATE);
        });
      }
    } else {
      const syncEndDate = !!selectedEndDate;
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null
      }, () => {
        // Sync start date with parent *after* state update.
        onDateChange(this.state.selectedStartDate, Utils.START_DATE);
        if (syncEndDate) {
          // sync end date with parent - must be cleared if previously set.
          onDateChange(null, Utils.END_DATE);
        }
      });
    }
  }

  // ----------------------------------------------------------------
  // ToDo: Deprecated. Remove entire function and refactor accordingly.
  updateDayOfWeekStyles(currentDate) {
    if (this.props.customDatesStyles instanceof Function) {
      return { customDatesStyles: this.props.customDatesStyles };
    }

    const {
      startFromMonday,
      dayOfWeekStyles, //ToDo: Deprecated. Remove.
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
        console.warn('CalendarPicker: dayOfWeekStyles is deprecated. Use customDatesStyles / customDayHeaderStyles callbacks instead.');
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
      console.warn('CalendarPicker: customDatesStylesPriority is deprecated. Use customDatesStyles / customDayHeaderStyles callbacks instead.');
      customDatesStyles = [...propsCustomDatesStyles, ...customDayOfWeekStyles];
    }

    return { customDatesStyles };
  }
  // ----------------------------------------------------------------

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
    // ----------------------------------------------------------------
    // ToDo: Deprecated. Remove
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
    // ----------------------------------------------------------------

    this.setState({
      ...dayOfWeekStyles, //ToDo: Deprecated. Remove.
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

  handleOnSelectMonthYear({month, year}) {
    this.setState({
      currentYear: year,
      currentMonth: month,
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
      minRangeDuration,
      maxRangeDuration,
      selectedStartDate,
      selectedEndDate,
      disabledDates,
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
      previousComponent,
      nextComponent,
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
      disabledDatesTextStyle,
      swipeConfig,
      enableDateChange,
      restrictMonthNavigation,
      headingLevel,
      dayLabelsWrapper,
      dayOfWeekStyles, // ToDo: Deprecated. Remove.
      customDayHeaderStyles,
      selectMonthTitle,
      selectYearTitle,
      showDayStragglers,
      monthYearHeaderWrapperStyle,
    } = this.props;

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
          onSelectMonth={this.handleOnSelectMonthYear}
          headingLevel={headingLevel}
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
          currentMonth={currentMonth}
          currentYear={currentYear}
          minDate={minDate}
          maxDate={maxDate}
          restrictNavigation={restrictMonthNavigation}
          previousComponent={previousComponent}
          nextComponent={nextComponent}
          previousTitle={previousTitle}
          nextTitle={nextTitle}
          previousTitleStyle={previousTitleStyle}
          nextTitleStyle={nextTitleStyle}
          onSelectYear={this.handleOnSelectMonthYear}
          headingLevel={headingLevel}
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
            previousComponent={previousComponent}
            nextComponent={nextComponent}
            previousTitle={previousTitle}
            nextTitle={nextTitle}
            previousTitleStyle={previousTitleStyle}
            nextTitleStyle={nextTitleStyle}
            textStyle={textStyle}
            restrictMonthNavigation={restrictMonthNavigation}
            minDate={minDate}
            maxDate={maxDate}
            headingLevel={headingLevel}
            monthYearHeaderWrapperStyle={monthYearHeaderWrapperStyle}
          />
          <Weekdays
            styles={styles}
            startFromMonday={startFromMonday}
            currentMonth={currentMonth}
            currentYear={currentYear}
            weekdays={weekdays}
            textStyle={textStyle}
            dayLabelsWrapper={dayLabelsWrapper}
            dayOfWeekStyles={dayOfWeekStyles}
            customDayHeaderStyles={customDayHeaderStyles}
          />
          <DaysGridView
            enableDateChange={enableDateChange}
            month={currentMonth}
            year={currentYear}
            styles={styles}
            onPressDay={this.handleOnPressDay}
            disabledDates={disabledDates}
            disabledDatesTextStyle={disabledDatesTextStyle}
            minRangeDuration={minRangeDuration}
            maxRangeDuration={maxRangeDuration}
            startFromMonday={startFromMonday}
            allowRangeSelection={allowRangeSelection}
            allowBackwardRangeSelect={allowBackwardRangeSelect}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            minDate={minDate}
            maxDate={maxDate}
            showDayStragglers={showDayStragglers}
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
