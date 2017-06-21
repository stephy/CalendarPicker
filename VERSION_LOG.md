@contributors:

Please do not change this file when creating a pull request

# NPM Versioning Log

### Version 3.0.0
	- Add min and max date
	- Update calendar on props change
	Details
		- Add min and max date
			Disables the day if it's less than minDate or greater than maxDate.
			Also disables next and previous links when appropriate.
		- Update calendar on props change
			This is necessary when you're changing the selectedDate prop of CalendarPicker programmatically.
			For example, in our app after a user selects a date and clicks submit, we reset the form and set the CalendarPicker selectedDate to new Date(). However, the CalendarPicker calendar doesn't actually update.

### Version 4.0.0

	- Add support for range date

### Version 5.0.0

	- Component Rewrite in ES6
	- Attempt to keep all functionalities and be backwards compatible

### Version 5.7.0

	- Add gesture recognition, you can now swipe left and right to go to previous and next months


### Version 5.8.0

	- Add support for initial date, Date that calendar opens to. Defaults to today. Fix expo dependencies
