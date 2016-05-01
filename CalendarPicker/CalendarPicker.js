/**
 * Calendar Picker Component
 * By Stephani Alves - April 11, 2015
 */
'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} = React;

var {
  WEEKDAYS,
  MONTHS,
  MAX_ROWS,
  MAX_COLUMNS,
  getDaysInMonth,
} = require('./Util');

var styles = require('./Styles');

var Day = React.createClass({
  propTypes: {
    onDayChange: React.PropTypes.func,
    selected: React.PropTypes.bool,
    day: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string
    ]).isRequired,
    screenWidth: React.PropTypes.number,
    selectedBackgroundColor: React.PropTypes.string,
    styleSelectedDayText: Text.propTypes.style,
  },
  getDefaultProps () {
    return {
      onDayChange () {},
      selectedBackgroundColor: '#5ce600'
    }
  },

  getInitialState () {
    this.DAY_WIDTH = (this.props.screenWidth - 16)/7;
    this.SELECTED_DAY_WIDTH = (this.props.screenWidth - 16)/7 - 10;
    this.BORDER_RADIUS = this.SELECTED_DAY_WIDTH/2;
    return null;
  },

  render() {
    return (
      <View style={[styles.dayWrapper, {width: this.DAY_WIDTH, height: this.DAY_WIDTH}]}>
        <View style={{backgroundColor: this.props.selected ? this.props.selectedBackgroundColor : 'transparent', width: this.SELECTED_DAY_WIDTH, height: this.SELECTED_DAY_WIDTH, borderRadius: this.BORDER_RADIUS}}>
          <TouchableOpacity
            style={[styles.dayButton, {width: this.SELECTED_DAY_WIDTH, height: this.SELECTED_DAY_WIDTH, borderRadius: this.BORDER_RADIUS}]}
            onPress={() => this.props.onDayChange(this.props.day) }>
            <Text style={[styles.dayLabel, this.props.selected ? this.props.styleSelectedDayText : {color: '#000'}]}>
              {this.props.day}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});

var Days = React.createClass({
  propTypes: {
    date: React.PropTypes.instanceOf(Date).isRequired,
    month: React.PropTypes.number.isRequired,
    year: React.PropTypes.number.isRequired,
    onDayChange: React.PropTypes.func.isRequired,
    screenWidth: React.PropTypes.number,
    selectedBackgroundColor: React.PropTypes.string,
    styleSelectedDayText: Text.propTypes.style,
    startFromMonday: React.PropTypes.bool,
  },
  getInitialState() {
    return {
      selectedStates: [],
    };
  },

  componentDidMount() {
    this.updateSelectedStates(this.props.date.getDate());
  },

  updateSelectedStates(day) {
    var selectedStates = [],
      daysInMonth = getDaysInMonth(this.props.month, this.props.year),
      i;

    for (i = 1; i <= daysInMonth; i++) {
      if (i === day) {
        selectedStates.push(true);
      } else {
        selectedStates.push(false);
      }
    }

    this.setState({
      selectedStates: selectedStates,
    });

  },

  onPressDay(day) {
    this.updateSelectedStates(day);
    this.props.onDayChange({day: day});
  },

  // Not going to touch this one - I'd look at whether there is a more functional
  // way you can do this using something like `range`, `map`, `partition` and such
  // (see underscore.js), or just break it up into steps: first generate the array for
  // data, then map that into the components
  getCalendarDays() {
    var columns,
      matrix = [],
      i,
      j,
      month = this.props.month,
      year = this.props.year,
      currentDay = 0,
      thisMonthFirstDay = new Date(year, month, 1),
      slotsAccumulator = 0,
      slotsAccumulatorOffset = this.props.startFromMonday ? 1 : 0;

    for(i = 0; i < MAX_ROWS; i++ ) { // Week rows
      columns = [];

      for(j = 0; j < MAX_COLUMNS; j++) { // Day columns
        if (slotsAccumulator + slotsAccumulatorOffset >= thisMonthFirstDay.getDay()) {
          if (currentDay < getDaysInMonth(month, year)) {
            columns.push(<Day
                      key={j}
                      day={currentDay+1}
                      selected={this.state.selectedStates[currentDay]}
                      date={this.props.date}
                      onDayChange={this.onPressDay}
                      screenWidth={this.props.screenWidth}
                      selectedBackgroundColor={this.props.selectedBackgroundColor}
                      styleSelectedDayText={this.props.styleSelectedDayText} />);
            currentDay++;
          }
        } else {
          columns.push(<Day
                          key={j}
                          day={''}
                          screenWidth={this.props.screenWidth}/>);
        }

        slotsAccumulator++;
      }
      matrix[i] = [];
      matrix[i].push(<View style={styles.weekRow}>{columns}</View>);
    }

    return matrix;
  },

  render() {
    return <View style={styles.daysWrapper}>{ this.getCalendarDays() }</View>;
  }

});

var WeekDaysLabels = React.createClass({
  propTypes: {
    screenWidth: React.PropTypes.number
  },
  getInitialState() {
    this.DAY_WIDTH = (this.props.screenWidth - 16)/7;
    return null;
  },
  render() {
    return (
      <View style={styles.dayLabelsWrapper}>
        { (this.props.weekdays || WEEKDAYS).map((day, key) => { return <Text key={key} style={[styles.dayLabels, {width: this.DAY_WIDTH}]}>{day}</Text> }) }
      </View>
    );
  }
});

var HeaderControls = React.createClass({
  propTypes: {
    month: React.PropTypes.number.isRequired,
    getNextYear: React.PropTypes.func.isRequired,
    getPrevYear: React.PropTypes.func.isRequired,
    onMonthChange: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      selectedMonth: this.props.month
    };
  },

  // Logic seems a bit awkawardly split up between here and the CalendarPicker
  // component, eg: getNextYear is actually modifying the state of the parent,
  // could just let header controls hold all of the logic and have CalendarPicker
  // `onChange` callback fire and update itself on each change
  getNext() {
    var next = this.state.selectedMonth + 1;
    if (next > 11) {
      this.setState({ selectedMonth: 0 });
      this.props.getNextYear();
    } else {
      this.setState({ selectedMonth: next });
    }

    this.props.onMonthChange(this.state.selectedMonth);
  },

  getPrevious() {
    var prev = this.state.selectedMonth - 1;
    if (prev < 0) {
      this.setState({ selectedMonth: 11 });
      this.props.getPrevYear();
    } else {
      this.setState({ selectedMonth: prev });
    }

    this.props.onMonthChange(this.state.selectedMonth);
  },

  render() {
    return (
      <View style={styles.headerWrapper}>
        <View style={styles.prevMonthSelector}>
          <TouchableOpacity onPress={this.getPrevious}>
            <Text style={styles.prev}>{this.props.previousTitle || 'Previous'}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.monthLabel}>
            { (this.props.months || MONTHS)[this.state.selectedMonth] } { this.props.year }
          </Text>
        </View>
        <View style={styles.nextMonthSelector}>
          <TouchableOpacity onPress={this.getNext}>
            <Text style={styles.next}>{this.props.nextTitle || 'Next'}</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
});

var CalendarPicker = React.createClass({
  propTypes: {
    selectedDate: React.PropTypes.instanceOf(Date).isRequired,
    onDateChange: React.PropTypes.func,
    screenWidth: React.PropTypes.number.isRequired,
    selectedBackgroundColor: React.PropTypes.string,
    styleSelectedDayText: Text.propTypes.style,
    startFromMonday: React.PropTypes.bool,
    weekdays: React.PropTypes.array,
    months: React.PropTypes.array,
    previousTitle: React.PropTypes.string,
    nextTitle: React.PropTypes.string,
  },
  getDefaultProps() {
    return {
      onDateChange () {}
    }
  },
  getInitialState() {
    return {
      date: this.props.selectedDate,
      day: this.props.selectedDate.getDate(),
      month: this.props.selectedDate.getMonth(),
      year: this.props.selectedDate.getFullYear(),
      selectedDay: [],
    };
  },

  onDayChange(day) {
    this.setState({day: day.day,});
    this.onDateChange();
  },

  onMonthChange(month) {
    this.setState({month: month,});
    this.onDateChange();
  },

  getNextYear(){
    this.setState({year: this.state.year + 1,});
    this.onDateChange();
  },

  getPrevYear() {
    this.setState({year: this.state.year - 1,});
    this.onDateChange();
  },

  onDateChange() {
    var {
      day,
      month,
      year
    } = this.state,
      date = new Date(year, month, day);

    this.setState({date: date,});
    this.props.onDateChange(date);
  },

  render() {
    return (
      <View style={styles.calendar}>
        <HeaderControls
          year={this.state.year}
          month={this.state.month}
          onMonthChange={this.onMonthChange}
          getNextYear={this.getNextYear}
          getPrevYear={this.getPrevYear}
          months={this.props.months}
          previousTitle={this.props.previousTitle}
          nextTitle={this.props.nextTitle}
        />

        <WeekDaysLabels
          screenWidth={this.props.screenWidth}
          weekdays={this.props.weekdays}/>

        <Days
          month={this.state.month}
          year={this.state.year}
          date={this.state.date}
          onDayChange={this.onDayChange}
          screenWidth={this.props.screenWidth}
          selectedBackgroundColor={this.props.selectedBackgroundColor}
          styleSelectedDayText={this.props.styleSelectedDayText}
          startFromMonday={this.props.startFromMonday}
        />
      </View>
    );
  }
});

module.exports = CalendarPicker;
