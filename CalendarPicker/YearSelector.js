// Parent view for Year selector

import React, { Component } from 'react';
import { View } from 'react-native';
import YearsGridView from './YearsGridView';
import YearsHeader from './YearsHeader';

export default class YearSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentYear: props.currentYear,
    };
  }

  handleOnYearViewPrevious = () => {
    this.setState({
      currentYear: parseInt(Math.max(this.state.currentYear - 25, 0))
    });
  }

  handleOnYearViewNext = () => {
    this.setState({
      currentYear: parseInt(this.state.currentYear + 25)
    });
  }

  render() {
    const {
      styles,
      textStyle,
      title,
      initialDate,
      minDate,
      maxDate,
      restrictNavigation,
      previousComponent,
      nextComponent,
      previousTitle,
      nextTitle,
      previousTitleStyle,
      nextTitleStyle,
      headingLevel,
      onSelectYear,
      disabledDates
    } = this.props;

    return (
      <View>
        <YearsHeader
          styles={styles}
          textStyle={textStyle}
          title={title}
          headingLevel={headingLevel}
          initialDate={initialDate}
          minDate={minDate}
          maxDate={maxDate}
          restrictNavigation={restrictNavigation}
          currentYear={this.state.currentYear}
          previousComponent={previousComponent}
          nextComponent={nextComponent}
          previousTitle={previousTitle}
          nextTitle={nextTitle}
          previousTitleStyle={previousTitleStyle}
          nextTitleStyle={nextTitleStyle}
          onYearViewPrevious={this.handleOnYearViewPrevious}
          onYearViewNext={this.handleOnYearViewNext}
        />
        <YearsGridView
          intialYear={this.state.currentYear}
          styles={styles}
          onSelectYear={onSelectYear}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          textStyle={textStyle}
        />
      </View>
    );
  }
}
