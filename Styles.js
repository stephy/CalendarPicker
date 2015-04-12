/**
 * Calendar Picker Component
 * By Stephani Alves - April 11, 2015
 */
'use strict';

var StyleSheet = require('react-native').StyleSheet;

var styles = StyleSheet.create({
  calendar: {
    alignSelf: 'center',
    height: 300,
    marginTop: 10
  },

  iconPrev: {
    flex: 1,
    paddingTop: 5
  },

  iconNext: {
    flex: 1,
    paddingTop: 5
  },

  icon: {
    width: 15,
    height: 15,
  },

  dayWrapper: {
    width: 50,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.0)'
  },

  dayButton: {
    width: 50,
    height: 40,
    alignSelf: 'center'
  },

  dayButtonSelected: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5ce600',
    alignSelf: 'center'
  },

  dayLabel: {
    fontSize: 14,
    color: '#000',
    marginTop: 6,
    alignSelf: 'center'
  },

  dayLabelsWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.0)',
    borderColor: 'rgba(0,0,0,0.2)'
  },

  dayLabels: {
    width: 50,
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
  },

  selectedDay: {
    width: 60,
    height:60,
    backgroundColor: '#5ce600',
    borderRadius: 30,
    alignSelf: 'center'
  },

  monthLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    width: 320,
    textAlign: 'center'
  },

  monthLabelWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 5,
    paddingBottom: 3,
    backgroundColor: 'rgba(0,0,0,0.0)'
  },

  yearLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center'
  },

  weeks: {
    flexDirection: 'column'
  },

  weekRow: {
    flexDirection: 'row'
  }
});
