/* eslint-env jasmine */

import React from 'react';
import renderer from 'react-test-renderer';
import CalenderPicker from '../index';

describe('CalendarPicker', function() {
  it('It renders calendar picker', () => {
    const CalendarPicker = renderer.create(
      <CalenderPicker
        initialDate={new Date(2017, 11, 31)}
      />
    ).toJSON();
    expect(CalendarPicker).toBeTruthy();
  });

  it('It renders calendar picker with props', () => {
    const minDate = new Date(2017, 6, 1);
    const maxDate = new Date(2017, 6, 3);
    const CalendarPicker = renderer.create(
      <CalenderPicker
        startFromMonday={true}
        allowRangeSelection={true}
        initialDate={new Date(2017, 11, 31)}
        minDate={minDate}
        maxDate={maxDate}
        todayBackgroundColor="#f2e6ff"
        selectedDayColor="#7300e6"
        selectedDayTextColor="#FFFFFF"
        onDateChange={() => {}}
      />
    ).toJSON();
    expect(CalendarPicker).toBeTruthy();
  });

  it('It handle selectedStartDate and selectedEndDate props', () => {
    const selectedStartDate = new Date(2018, 5, 1);
    const selectedEndDate = new Date(2018, 5, 15);
    const CalendarPicker = renderer.create(
      <CalenderPicker
        allowRangeSelection={true}
        initialDate={new Date(2019, 1, 20)}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
        onDateChange={() => {}}
      />
    ).toJSON();
    expect(CalendarPicker).toBeTruthy();
  });
});
