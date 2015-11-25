/**
 * Calendar Picker Component
 * By Stephani Alves - April 11, 2015
 */
'use strict';

var StyleSheet = require('react-native').StyleSheet;

var {width, height,} = require('Dimensions').get('window'); 
var styles = StyleSheet.create({
  calendar: {
    height: 320,
    width: width,
    marginTop: 10
  },
  dayWrapper: {
    width: width/7,
    height: width/7,
    borderRadius: width/7/2,
    backgroundColor: 'rgba(0,0,0,0.0)'
  },

  dayButton: {
    width: width/7,
    height: width/7,
    borderRadius: width/7/2,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  dayButtonSelected: {
    width: width/7,
    height: width/7,
    borderRadius: width/7/2,
    backgroundColor: '#D6BA79',
    alignSelf: 'center'
  },

  dayLabel: {
    fontSize: 14,
    color: '#000',
    marginTop: 0,
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
    alignSelf: 'center',
  },

  dayLabels: {
    width: width/7,
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
  },

  selectedDay: {
    width: width/7,
    height: width/7,
    backgroundColor: '#5ce600',
    borderRadius: width/7/2,
    alignSelf: 'center'
  },

  monthLabel: {
    fontSize: 16,
    color: '#000',
    width: width/3,
    textAlign: 'center'
  },

  headerWrapper: {
    alignItems: 'center',  
    flexDirection: 'row',
    alignSelf: 'center',
    width: width,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingBottom: 3,
    backgroundColor: 'rgba(0,0,0,0.0)'
  },

  monthSelector: {
    width: width/3 - 16,
  },

  prev: {
    textAlign: 'left'
  },

  next: {
    textAlign: 'right'
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

module.exports = styles;
