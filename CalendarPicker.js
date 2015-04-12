/**
 * Calendar Picker Component
 * By Stephani Alves - April 11, 2015
 */
'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableOpacity,
  ScrollView
} = React;

var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  MAX_ROWS = 7,
  MAX_COLUMNS = 7,
  _getDaysInMonth = function(month, year) {
    var lastDayOfMonth = new Date(year, month+1, 0);
    return lastDayOfMonth.getDate();
  };

var Day = React.createClass({
  renderDay: function() {
    if (this.props.selected === 1) {
      return (
        <View style={styles.dayButtonSelected}>
          <TouchableOpacity
            style={styles.dayButton}
            onPress={() => this.props.onDayChange(this.props.day) }>
            <Text style={styles.dayLabel}>{this.props.day}</Text>
          </TouchableOpacity>
        </View>
        );
    } else {
      return (
        <TouchableOpacity
          style={styles.dayButton}
          onPress={() => this.props.onDayChange(this.props.day) }>
          <Text style={styles.dayLabel}>{this.props.day}</Text>
        </TouchableOpacity>

        );
    }
  },

  render: function() {
    return (
      <View style={styles.dayWrapper}>
        {this.renderDay()}
      </View>
    );
  }
});

var Days = React.createClass({
  getInitialState: function() {
    return {
      selectedStates: [],
      calendarDays: null
    };
  },

  updateSelectedStates: function(day) {
    var selectedStates = [],
      daysInMonth = _getDaysInMonth(this.props.month, this.props.year),
      i;

    for (i = 1; i <= daysInMonth; i++) {
      if (day && i === day) {
        selectedStates.push(1);
      } else {
        selectedStates.push(0);
      }
    }

    this.setState({
      selectedStates: selectedStates
    });
  },

  handleDayChange: function(day) {
    this.updateSelectedStates(day);
    this.props.onDayChange({ day: day });
  },

  getCalendarDays: function() {
    var columns,
      matrix = [],
      i,
      j,
      month = this.props.month,
      year = this.props.year,
      currentDay = 0,
      thisMonthFirstDay = new Date(year, month, 1),
      slotsAccumulator = 0;

    for(i = 0; i < MAX_ROWS; i++ ) { // Week rows
      columns = [];
      for(j = 0; j < MAX_COLUMNS; j++) { // Day columns
        if (slotsAccumulator >= thisMonthFirstDay.getDay()) {
          if (currentDay < _getDaysInMonth(month, year)) {
            // check to see if the day is selected
            if (this.state.selectedStates[currentDay] > 0) {
              columns.push(<Day
                      day={currentDay+1}
                      selected={this.state.selectedStates[currentDay]}
                      date={this.props.date}
                      onDayChange={this.props.onDayChange} />);
            } else {
              columns.push(<Day
                      day={currentDay+1}
                      selected={this.state.selectedStates[currentDay]}
                      date={this.props.date}
                      onDayChange={this.handleDayChange} />);
            }
            currentDay++;
          }
        } else {
          columns.push(<Day day={''}/>);
        }

        slotsAccumulator++;
      }
      matrix[i] = [];
      matrix[i].push(<View style={styles.weekRow}>{columns}</View>);
    }

    return matrix;
  },


  render: function() {
    return (
      <View>
        { this.getCalendarDays() }
      </View>
    );
  }

});

var WeekDaysLabels = React.createClass({
  render: function() {
    return(
      <View style={styles.dayLabelsWrapper}>
        { WEEKDAYS.map(function(obj, i) {
          return (<Text style={styles.dayLabels}> { obj }</Text>);
        }) }
      </View>
    );
  }
});

var HeaderControls = React.createClass({
  getInitialState: function() {
    return {
      selectedMonth: this.props.month
    };
  },

  getNext: function() {
    var next = this.state.selectedMonth + 1;
    if (next > 11) {
      this.setState({ selectedMonth: 0 });
      // go to next year
      this.props.getNextYear();
    } else {
      this.setState({ selectedMonth: next });
    }

    this.props.onMonthChange(this.state.selectedMonth);

  },

  getPrevious: function() {
    var prev = this.state.selectedMonth - 1;
    if (prev < 0) {
      this.setState({ selectedMonth: 11 });
      // go to previous year
      this.props.getPrevYear();
    } else {
      this.setState({ selectedMonth: prev });
    }

    this.props.onMonthChange(this.state.selectedMonth);
  },

  render: function() {
    return(
      <View style={styles.monthLabelWrapper}>
        <View style={styles.iconPrev}>
          <TouchableOpacity onPress={() => this.getPrevious() }>
            <Image
              style={styles.icon}
              source={{ uri: 'http://stephanimoroni.com/kalendar/images/arrow-left@3x.png'}}/>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.monthLabel}> { MONTHS[this.state.selectedMonth] } { this.props.year }</Text>
        </View>
        <View style={styles.iconNext}>
          <TouchableOpacity onPress={() => this.getNext() }>
            <Image
              style={styles.icon}
              source={{ uri: 'http://stephanimoroni.com/kalendar/images/arrow-right@3x.png'}}/>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
});

var CalendarPicker = React.createClass({
  getInitialState: function() {
    return {
      date: this.props.selectedDate,
      day: this.props.selectedDate.getDate(),
      month: this.props.selectedDate.getMonth(),
      year: this.props.selectedDate.getFullYear(),
      selectedDay: []
    };
  },

  onDayChange: function(day) {
    this.setState({
      day: day.day
    });

    this.onDateChange();
  },

  onMonthChange: function(month) {
    this.setState({
      month: month
    });
    this.onDateChange();
  },

  getNextYear: function(){
    this.setState({
      year: this.state.year+1
    });
    this.onDateChange();
  },

  getPrevYear: function() {
    this.setState({
      year: this.state.year-1
    });
    this.onDateChange();
  },

  onDateChange: function() {
    var day =  this.state.day,
      month = this.state.month,
      year = this.state.year;

    var date = new Date(year, month, day);

    this.setState({
      date: date
    });

    this.props.onDateChange(date);
  },

  render: function() {
    return (
      <View style={styles.calendar}>
        <HeaderControls
          year= {this.state.year}
          month={this.state.month}
          onMonthChange={this.onMonthChange}
          getNextYear={this.getNextYear}
          getPrevYear={this.getPrevYear} />

        <WeekDaysLabels />

        <Days
          month={this.state.month}
          year={this.state.year}
          date={this.state.date}
          onDayChange={this.onDayChange} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  calendar: {
    alignSelf: 'center',
    height: 300,
    marginTop: 10
  },

  iconPrev: {
    flex: 1,
    paddingTop: 5
  },

  iconNext: {
    flex: 1,
    paddingTop: 5
  },

  icon: {
    width: 15,
    height: 15,
  },

  dayWrapper: {
    width: 50,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.0)'
  },

  dayButton: {
    width: 50,
    height: 40,
    alignSelf: 'center'
  },

  dayButtonSelected: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5ce600',
    alignSelf: 'center'
  },

  dayLabel: {
    fontSize: 14,
    color: '#000',
    marginTop: 6,
    alignSelf: 'center'
  },

  dayLabelsWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.0)',
    borderColor: 'rgba(0,0,0,0.2)'
  },

  dayLabels: {
    width: 50,
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
  },

  selectedDay: {
    width: 60,
    height:60,
    backgroundColor: '#5ce600',
    borderRadius: 30,
    alignSelf: 'center'
  },

  monthLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    width: 320,
    textAlign: 'center'
  },

  monthLabelWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 5,
    paddingBottom: 3,
    backgroundColor: 'rgba(0,0,0,0.0)'
  },

  yearLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center'
  },

  weeks: {
    flexDirection: 'column'
  },

  weekRow: {
    flexDirection: 'row'
  }
});

module.exports = CalendarPicker;
