/**
 * Calendar Picker Component
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */

export const Utils = {
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',
  WEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  WEEKDAYS_MON: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  MONTHS: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ],
  MAX_ROWS: 7,
  MAX_COLUMNS: 7,
  getDaysInMonth: function(month, year) {
    const lastDayOfMonth = new Date(year, month + 1, 0);
    return lastDayOfMonth.getDate();
  },
  isSameMonthAndYear: function(date, month, year) {
    if (date) {
      return date.month() === month && date.year() === year;
    }
    return false;
  },
  // Test whether objects' values are different.
  // `exclusions` param ignores provided keys.
  // Returns array of keys that are different (empty array means identical).
  shallowDiff: function(a, b, exclusions = []) {
    const diffs = [];
    for (let key of Object.keys(a)) {
      if (exclusions.includes(key)) {
        continue;
      }
      if (a[key] !== b[key]) {
        diffs.push(key);
      }
    }
    return diffs;
  },
  // Robust compare Moment dates.
  compareDates: function(a, b, granularity) {
    // Allow for falsy (null & undefined) equality.
    if (!a && !b) {
      return true;
    }
    return !!a && !!b && a.isSame(b, granularity);
  }
};
