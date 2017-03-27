# react-native-calendar-picker [![npm version](https://badge.fury.io/js/react-native-calendar-picker.svg)](https://badge.fury.io/js/react-native-calendar-picker)

[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/react-native-calendar-picker)

Calendar Picker Component for React Native [![Build Status](https://travis-ci.org/stephy/CalendarPicker.svg?branch=master)](https://travis-ci.org/stephy/CalendarPicker)

This is a Calendar Picker Component for React Native

![alt tag](https://raw.githubusercontent.com/stephy/CalendarPicker/master/assets/basic-react-native-calendar-picker.gif)

To use the calendar you just need to:
```sh
npm install --save react-native-calendar-picker
```

*Note: react-native-calendar-picker v5 is a complete re-write of the calendar. This calendar is now written using ES6 syntax. I kept most of the same functionalities and added support for date ranges.*

If you need the old code I saved it on a branch <a href="https://github.com/stephy/CalendarPicker/tree/v4">v4</a>

# How to use it

```js
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import CalendarPicker from './CalendarPicker';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }
  render() {
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    return (
      <View style={styles.container}>
        <CalendarPicker
          onDateChange={this.onDateChange}
        />

        <View>
          <Text>SELECTED DATE:{ startDate }</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
  },
});
```
## CalendarPicker Props
| Prop | Type | Description |
:------------ |:---------------| :-----|
| **`weekdays`** | `Array` | Optional. List of week days. Eg. `['Mon', 'Tue', ...]` Must be 7 days |
| **`months`** | `Array` | Optional. List of months names. Eg. `['Jan', 'Feb', ...]` Must be 12 months |
| **`startFromMonday`** | `Boolean` | Optional. Default first day of week will be Sunday. You can set start of week from Monday by setting this to true. Default is `false` |
| **`allowRangeSelection`** | `Boolean` | Optional. Allow to select date ranges. Default is `false` |
| **`previousTitle`** | `String` | Optional. Title of button for previous month. Default is `Previous` |
| **`nextTitle`** | `String` | Optional. Title of button for next month. Default is `Next` |
| **`selectedDayColor`** | `String` | Optional. Color for selected day |
| **`selectedDayTextColor`** | `String` | Optional. Text color for selected day |
| **`todayBackgroundColor`** | `String` | Optional. Background color for today. Default is `#cccccc` |
| **`textStyle`** | `Object` | Optional. Style overall text. Change fontFamily, color, etc. |
| **`scaleFactor`** | `Number` | Optional. Default scales to window width |
| **`minDate`** | `Date` | Optional. Specifies minimum date to be selected |
| **`maxDate`** | `Date` | Optional. Specifies maximum date to be selected |

# Styles
Some styles will overwrite some won't. For instance:
- If you provide textStyle with fontFamily and color, out of ranges dates will not apply your color, just fontFamily.

Order of precedence:

- defaultColor => textStyle => selectedDayColor
- defaultTodayBackgroundColor => todayBackgroundColor
- defaultBackgroundColor => selectedDayColor
- defaultTextStyles => textStyle => selectedDayTextColor


# To Do

- Add swipe gestures

# More Examples

### Start from Monday, allowRangeSelection, Min and Max Dates and Styles Changes Example
![alt tag](https://raw.githubusercontent.com/stephy/CalendarPicker/master/assets/default-react-native-calendar-picker.gif)
```js
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      selectedEndDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date, type) {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  }

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date(); // Today
    const maxDate = new Date(2017, 6, 3);
    const startDate  =  selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';

    return (
      <View style={styles.container}>
        <CalendarPicker
          startFromMonday={true}
          allowRangeSelection={true}
          minDate={minDate}
          maxDate={maxDate}
          todayBackgroundColor="#f2e6ff"
          selectedDayColor="#7300e6"
          selectedDayTextColor="#FFFFFF"
          onDateChange={this.onDateChange}
        />

        <View>
          <Text>SELECTED START DATE:{ startDate }</Text>
          <Text>SELECTED END DATE:{ endDate }</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
  },
});
```

### Complex Example, Changing Fonts and Colors, Language and etc...

![alt tag](https://github.com/stephy/CalendarPicker/blob/master/assets/react-native-calendar-picker-green-color-date-range.gif)

```js
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      selectedEndDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date, type) {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  }

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date(); // Today
    const maxDate = new Date(2017, 6, 3);
    const startDate  =  selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';

    return (
      <View style={styles.container}>
        <CalendarPicker
          startFromMonday={true}
          allowRangeSelection={true}
          minDate={minDate}
          maxDate={maxDate}
          weekdays={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']}
          months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
          previousTitle="Anterior"
          nextTitle="Próximo"
          todayBackgroundColor="#e6ffe6"
          selectedDayColor="#66ff33"
          selectedDayTextColor="#000000"
          scaleFactor={375}
          textStyle={{
            fontFamily: 'Cochin',
            color: '#000000',
          }}
          onDateChange={this.onDateChange}
        />

        <View>
          <Text>SELECTED START DATE:{ startDate }</Text>
          <Text>SELECTED END DATE:{ endDate }</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
  },
});
```

# Suggestions?

Open Issues. Submit PRs.

# Special Thanks

I would like to call out some contributors who have been helping with this project

- [edvinerikson](https://github.com/edvinerikson)
- [thomaswright](https://github.com/thomaswright)
- [brentvatne](https://github.com/brentvatne)
- [kesha-antonov](https://github.com/kesha-antonov)
- [jthestupidkid](https://github.com/jthestupidkid)
- [adamkrell](https://github.com/adamkrell)
- [joshuapinter](https://github.com/joshuapinter)


# Development

```sh
npm install

// running on device
npm start

// running on iOS Simulator
npm run ios
```
