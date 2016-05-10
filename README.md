# react-native-calendar-picker
Calendar Picker Component for React Native


This is a Calendar Picker Component for React Native
![alt tag](https://raw.github.com/stephy/CalendarPicker/master/calendarPicker.gif)

To use the calendar you just need to:

	npm install react-native-calendar-picker

How to use it:


	var CalendarPicker = require('react-native-calendar-picker');
	var Dimensions = require('Dimensions').get('window');

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
	          onDateChange={this.onDateChange}
	          screenWidth={Dimensions.width}
	          selectedDayColor={"#ff6767"} />

	        <Text style={styles.selectedDate}>Date:  { this.state.date.toString() } </Text>
	      </View>
	      
	    );
	  }
	});

## CalendarPicker props
| Prop | Type | Description |
:------------ |:---------------:| :-----|
| weekdays | array | List of week days. Eg. ['Mo', 'Tue', ...] Must be 7 days |
| months | array | List of months names. |
| startFromMonday | boolean | Default first day of week will be Sunday. You can set start of week from Monday. |
| previousTitle | string | Title of button for previous month. |
| nextTitle | string | Title of button for next month. |
| selectedDayColor | string | Color for selected day |
| scaleFactor | float | Optional. Default scales to window width |


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