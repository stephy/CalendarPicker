import React, { PropTypes, Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Utils } from './Utils';
import Controls from './Controls';

export default class HeaderControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: null,
      currentYear: null,
    }
    this.handleOnPressPrevious = this.handleOnPressPrevious.bind(this);
    this.handleOnPressNext = this.handleOnPressNext.bind(this);
  }

  componentWillMount() {
    const { initialDate } = this.props;
    const date = initialDate ? initialDate : new Date();

    this.setState({
      currentMonth: parseInt(date.getMonth()),
      currentYear: parseInt(date.getFullYear()),
    });
  }

  handleOnPressPrevious() {
    const { currentMonth, currentYear } = this.state;
    const previousMonth = currentMonth - 1;
    // if previousMonth is negative it means the current month is January,
    // so we have to go to previous year, and set the current month to December
    if (previousMonth < 0) {
      this.setState({
        currentMonth: parseInt(11), // setting month to December
        currentYear: parseInt(currentYear) - 1, // decrement year
      });
    } else {
      this.setState({
        currentMonth: parseInt(previousMonth),
        currentYear: parseInt(currentYear),
      });
    }
  }

  handleOnPressNext() {
    const { currentMonth, currentYear } = this.state;
    const nextMonth = currentMonth + 1;
    // if nextMonth is greater than 11 it means the current month is December,
    // so we have to go to next year, and set the current month to January
    if (nextMonth > 11) {
      this.setState({
        currentMonth: parseInt(0), // setting month to December
        currentYear: parseInt(currentYear) + 1, // decrement year
      });
    } else {
      this.setState({
        currentMonth: parseInt(nextMonth),
        currentYear: parseInt(currentYear),
      });
    }
  }

  render() {
    const { styles, initialDate } = this.props;
    const { currentMonth, currentYear } = this.state;
    const MONTHS = Utils.MONTHS; // English Month Array
    const date = initialDate ? initialDate : new Date();
    // getMonth() call below will return the month number, we will use it as the
    // index for month array in english
    const month = MONTHS[currentMonth];
    const year = currentYear;

    return (
      <View style={styles.headerWrapper}>
        <View style={styles.monthSelector}>
          <Controls
            label="Previous"
            onPressControl={this.handleOnPressPrevious}
            styles={styles.prev}
          />
        </View>
        <View>
          <Text style={[styles.monthLabel]}>
             { month } { year }
          </Text>
        </View>
        <View style={styles.monthSelector}>
          <Controls
            label="Next"
            onPressControl={this.handleOnPressNext}
            styles={styles.next}
          />
        </View>

      </View>
    );
  }
}

HeaderControls.propTypes = {
  initialDate: PropTypes.instanceOf(Date),
};
