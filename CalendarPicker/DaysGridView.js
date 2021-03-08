import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { stylePropType } from './localPropTypes';
import Day from './Day';
import EmptyDay from './EmptyDay';
import { Utils } from './Utils';
import moment from 'moment';

export default class DaysGridView extends Component {
  constructor(props) {
    super(props);

    this.initMonthSettings = props => {
      const {
        month,
        year,
        showDayStragglers,
        firstDay = 0,
      } = props;

      // Retrieve total days in this month & year, accounting for leap years.
      const numDaysInMonth = Utils.getDaysInMonth(month, year);

      // Calculate days in prev month for day stragglers.
      let prevMonth, prevMonthYear;
      let numDaysInPrevMonth;
      if (showDayStragglers) {
        prevMonth = month - 1;
        prevMonthYear = year;
        if (prevMonth < 0) {
          prevMonth = 11;
          prevMonthYear--;
        }
        numDaysInPrevMonth = Utils.getDaysInMonth(prevMonth, prevMonthYear);
      }

      // Create a date for day one of the current given month and year
      const firstDayOfMonth = moment({ year, month, day: 1 });

      // Determine which day of the week day 1 falls on.
      // See https://github.com/stephy/CalendarPicker/issues/49
      // isoWeekday() gets the ISO day of the week with 1=Monday and 7=Sunday.
      const firstWeekDay = firstDayOfMonth.isoWeekday();

      // Determine starting index based on first day of week prop.
      const startIndex = (firstDay > 0) ? (firstWeekDay + Utils.FIRST_DAY_OFFSETS[firstDay]) % 7 : firstWeekDay;

      return {
        maxWeekRows: 6,
        numDaysInWeek: 7,
        numDaysInMonth,
        numDaysInPrevMonth,
        firstDayOfMonth,
        firstWeekDay,
        startIndex,
      };
    };

    const monthSettings = this.initMonthSettings(props);
    this.state = {
      monthSettings,
      daysGrid: this.generateDaysGrid(monthSettings),
    };
  }

  componentDidUpdate(prevProps) {
    // Optimize re-renders by checking props, with special handling for selected dates.
    // Shallow compare prop changes, excluding selected dates.
    const propDiffs = Utils.shallowDiff(this.props, prevProps, ['selectedStartDate', 'selectedEndDate']);
    if (propDiffs.length) {
      // Recreate days
      const monthSettings = this.initMonthSettings(this.props);
      this.setState({
        monthSettings,
        daysGrid: this.generateDaysGrid(monthSettings),
      });
    }
    else {
      // Update daysGrid entries when selected date(s) affect this month.
      const { selectedStartDate, selectedEndDate } = this.props;
      const { selectedStartDate: prevSelStart, selectedEndDate: prevSelEnd } = prevProps;
      const { firstDayOfMonth } = this.state.monthSettings;
      const isSelectedDiff =
        !Utils.compareDates(selectedStartDate, prevSelStart, 'day') ||
        !Utils.compareDates(selectedEndDate, prevSelEnd, 'day');
      // Check that selected date(s) match this month.
      if (isSelectedDiff && (
        Utils.compareDates(selectedStartDate, firstDayOfMonth, 'month') ||
          Utils.compareDates(selectedEndDate, firstDayOfMonth, 'month') ||
          Utils.compareDates(prevSelStart, firstDayOfMonth, 'month') ||
          Utils.compareDates(prevSelEnd, firstDayOfMonth, 'month') ))
      {
        // Range selection potentially affects all dates in the month. Recreate.
        if (this.props.allowRangeSelection) {
          this.setState({
            daysGrid: this.generateDaysGrid(this.state.monthSettings),
          });
        }
        else {
          // Search for affected dates and modify those only
          const daysGrid = [...this.state.daysGrid];
          const { year } = this.props;
          for (let i = 0; i <daysGrid.length; i++) {
            for (let j = 0; j <daysGrid[i].length; j++) {
              const { month, day } = daysGrid[i][j];
              // Empty days and stragglers can't be selected.
              if (month === undefined) { continue; }
              // Check single date
              const thisDay = { year, month, day };
              const isSelected = Utils.compareDates(selectedStartDate, thisDay, 'day');
              const isPrevSelected = Utils.compareDates(prevSelStart, thisDay, 'day');
              if (isSelected || isPrevSelected)
              {
                daysGrid[i][j] = this.renderDayInCurrentMonth(day);
              }
            }
          }
          this.setState({ daysGrid });
        }
      }
    }
  }

  renderDayInCurrentMonth(day) {
    return ({
      day,
      month: this.props.month,
      component: (
        <Day
          key={day}
          day={day}
          {...this.props}
        />
      ),
    });
  }

  renderEmptyDay(key) {
    return ({
      component: (
        <EmptyDay
          key={'empty' + key}
          styles={this.props.styles}
        />
      ),
    });
  }

  renderDayStraggler({key, day}) {
    return ({
      day,
      // month doesn't matter for stragglers as long as isn't set to current month
      component: (
        <Day
          key={key}
          day={day}
          styles={this.props.styles}
          disabledDates={() => true}
          disabledDatesTextStyle={this.props.disabledDatesTextStyle}
          textStyle={this.props.textStyle}
        />
      )
    });
  }

  // Create grid of days.
  generateDaysGrid = params => {
    const {
      numDaysInWeek,
      maxWeekRows,
      startIndex,
      numDaysInMonth,
      numDaysInPrevMonth
    } = params;
    let daysGrid = [[]];
    let dayOfMonth = 1;
    let dayNextMonth = 1;
    let lastFilledRow = 0;

    // Week rows
    for (let i = 0; i < maxWeekRows; i++) {
      daysGrid[i] = [];
      // Days in week
      for (let j = 0; j < numDaysInWeek; j++) {
        if (i === 0) {
          // first row: start current month's day on the correct weekday
          if (j >= startIndex) {
            if (dayOfMonth <= numDaysInMonth) {
              daysGrid[i].push(this.renderDayInCurrentMonth(dayOfMonth++));
            }
          } else {
            const key = '' + i + j;
            daysGrid[i].push(this.props.showDayStragglers ?
              // Show previous month's days
              this.renderDayStraggler({
                key,
                day: numDaysInPrevMonth - startIndex + j + 1,
              })
              :
              //... otherwise blank
              this.renderEmptyDay(key)
            );
          }
        } else {
          if (dayOfMonth <= numDaysInMonth) {
            lastFilledRow = i;
            daysGrid[i].push(this.renderDayInCurrentMonth(dayOfMonth++));
          }
          else {
            if (this.props.showDayStragglers && i <= lastFilledRow) {
              // Show next month's days
              daysGrid[i].push(this.renderDayStraggler({
                key: '' + i + j,
                day: dayNextMonth++,
              }));
            }
          }
        }
      }
    }
    return daysGrid;
  }

  render() {
    const { styles } = this.props;
    const { daysGrid } = this.state;
    const renderedDaysGrid = daysGrid.map((weekRow, i) => (
      <View key={i} style={styles.weekRow}>
        { weekRow.map(day => day.component ) }
      </View>
    ));

    return (
      <View style={styles.daysWrapper}>
        { renderedDaysGrid }
      </View>
    );
  }
}

DaysGridView.propTypes = {
  styles: stylePropType,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  onPressDay: PropTypes.func,
  firstDay: PropTypes.number,
  selectedDayStyle: stylePropType,
  selectedRangeStartStyle: stylePropType,
  selectedRangeStyle: stylePropType,
  selectedRangeEndStyle: stylePropType,
  todayTextStyle: stylePropType,
  selectedDayTextStyle: stylePropType,
  customDatesStyles: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
        PropTypes.instanceOf(moment)
      ]),
      containerStyle: stylePropType,
      style: stylePropType,
      textStyle: stylePropType,
    })),
  ]),
  disabledDates: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  disabledDatesTextStyle: stylePropType,
  minRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  maxRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
};
