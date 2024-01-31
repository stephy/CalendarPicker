/**
 * Calendar Picker Component
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */

import { getMonth } from 'date-fns/getMonth';
import { getYear } from 'date-fns/getYear';
import { isSameDay } from 'date-fns/isSameDay';
import { isSameMonth } from 'date-fns/isSameMonth';
import { LunarDate } from "vietnamese-lunar-calendar";
import moment from 'moment';

const NATIONAL_HOLIDAYS = [
  {
    day: 20,
    month: 12,
    info: "",
  },
  {
    day: 21,
    month: 12,
    info: "",
  },
  {
    day: 22,
    month: 12,
    info: "",
  },
  {
    day: 23,
    month: 12,
    info: "",
  },
  {
    day: 24,
    month: 12,
    info: "",
  },
  {
    day: 25,
    month: 12,
    info: "",
  },
  {
    day: 26,
    month: 12,
    info: "",
  },
  {
    day: 27,
    month: 12,
    info: "",
  },
  {
    day: 28,
    month: 12,
    info: "",
  },
  {
    day: 29,
    month: 12,
    info: "",
  },
  {
    day: 30,
    month: 12,
    info: "",
  },

  {
    day: 1,
    month: 1,
    info: "Mùng 1",
  },
  {
    day: 2,
    month: 1,
    info: "Mùng 2",
  },
  {
    day: 3,
    month: 1,
    info: "Mùng 3",
  },
  {
    day: 4,
    month: 1,
    info: "Mùng 4",
  },

  {
    day: 5,
    month: 1,
    info: "Mùng 5",
  },
  {
    day: 6,
    month: 1,
    info: "Mùng 6",
  },
  {
    day: 7,
    month: 1,
    info: "Mùng 7",
  },
  {
    day: 8,
    month: 1,
    info: "Mùng 8",
  },
  {
    day: 9,
    month: 1,
    info: "Mùng 9",
  },
  {
    day: 10,
    month: 1,
    info: "Mùng 10",
  },
];

export const Utils = {
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',
  WEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  MONTHS: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ],
  MAX_ROWS: 7,
  MAX_COLUMNS: 7,
  FIRST_DAY_OFFSETS: [0, -1, 5, 4, 3, 2, 1],
  getDaysInMonth: function (month, year) {
    const lastDayOfMonth = new Date(year, month + 1, 0);
    return lastDayOfMonth.getDate();
  },
  isSameMonthAndYear: function (date, month, year) {
    if (date) {
      return getMonth(date) === month && getYear(date) === year;
    }
    return false;
  },
  // Test whether objects' values are different.
  // `exclusions` param ignores provided keys.
  // Returns array of keys that are different (empty array means identical).
  shallowDiff: function (a, b, exclusions = []) {
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
  compareDates: function (a, b, granularity) {
    // Allow for falsy (null & undefined) equality.
    if (!a && !b) {
      return true;
    }
    if (granularity === 'day') {
      return !!a && !!b && isSameDay(a, b);
    }
    if (granularity === 'month') {
      return !!a && !!b && isSameMonth(a, b);
    }
    return true;
  },
  getWeekdays: function (firstDay = 0) {
    let from = firstDay;
    const weekdays = [];
    for (let i = 0; i < Utils.WEEKDAYS.length; i++) {
      weekdays.push(Utils.WEEKDAYS[from]);
      from = from >= Utils.WEEKDAYS.length - 1 ? 0 : from + 1;
    }
    return weekdays;
  },
  getISOWeekdaysOrder: function (firstDay = 0) {
    let from = firstDay === 0 ? 7 : firstDay;
    const order = [];
    for (let i = 0; i < Utils.WEEKDAYS.length; i++) {
      order.push(from);
      from = from >= Utils.WEEKDAYS.length ? 1 : from + 1;
    }
    return order;
  },
  getLunarDay: function ({ year, month, day }, isShowLunarCalendar = false) {
    // Thuộc tính không hiện lịch âm
    if (!isShowLunarCalendar) {
      return null;
    }
    const lunar = new LunarDate(moment({year :year, month : month, day :day}).toDate());
    const lunarSelected = NATIONAL_HOLIDAYS.find((d) => d.day === lunar.date && d.month === lunar.month);
    if (lunarSelected) {
      return lunarSelected.info ? lunarSelected.info : `${String(lunar.date).padStart(2, "0")}/${String(lunar.month).padStart(2, "0")}`;
    }
    return null
  }
};
