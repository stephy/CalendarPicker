# react-native-calendar-picker
Calendar Picker Component for React Native


This is a Calendar Picker Component for React Native
![alt tag](https://raw.github.com/stephy/CalendarPicker/master/calendarPicker.gif)

To use the calendar you just need to:

	npm install react-native-calendar-picker

How to use it:

	var CalendarPicker = require('react-native-calendar-picker');

	var Calendar = React.createClass({
	  getInitialState: function() {
	    return {
	      date: new Date(),
	    };
	  },

	  onDateChange: function(date) {
	    this.setState({ date: date });
	  },

	  render: function() {
	    return (
	      <View style={styles.container}>
	      
	        <CalendarPicker 
	          selectedDate={this.state.date}
	          onDateChange={this.onDateChange} />

	        <Text style={styles.selectedDate}>Date:  { this.state.date.toString() } </Text>
	      </View>
	      
	    );
	  }
	});


# To Do:

- Add swipe gestures


# Suggestions?

Drop an email to alves@stephanimoroni.com

Open issues

Submit PRs.


# Special thanks

I would like to call out 2 contributors who have been helping me with this project

@edvinerikson

@brentvatne

Thanks you two :)