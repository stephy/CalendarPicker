/**
 * Calendar Picker Component
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
'use strict';

var StyleSheet = require('react-native').StyleSheet;

var styles = StyleSheet.create({
  calendar: {
    marginTop: 10
  },
  dayWrapper: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  dayButton: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center'
  },

  dayLabel: {
    fontSize: 14,
    color: '#000',
    alignSelf: 'center'
  },

  dayLabelsWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.0)',
    borderColor: 'rgba(0,0,0,0.2)'
  },

  daysWrapper: {
    alignSelf: 'center'
  },

  dayLabels: {
    textAlign: 'center'
  },

  monthLabel: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center'
  },

  headerWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 3,
    backgroundColor: 'rgba(0,0,0,0.0)'
  },

  prev: {
    textAlign: 'left'
  },

  next: {
    textAlign: 'right'
  },

  weeks: {
    flexDirection: 'column'
  },

  weekRow: {
    flexDirection: 'row'
  }
});

module.exports = styles;
