# CalendarPicker
CalendarPicker Component for React Native


This is a Calendar Picker Component for React Native
![alt tag](https://raw.github.com/stephy/CalendarPicker/master/calendarPicker.gif)

To use the calendar you just need to download CalendarPicker.js

https://github.com/stephy/CalendarPicker/blob/master/CalendarPicker.js

How to use it:

		var CalendarPicker = require('./CalendarPicker');

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

- Add swipe gesture
- Add selection for inital day


# Suggestions?

Drop an email to alves@stephanimoroni.com