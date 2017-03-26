/**
 * Calendar Picker Component
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
const DEFAULT_SELECTED_BACKGROUND_COLOR = '#5ce600';
const DEFAULT_SELECTED_TEXT_COLOR = '#000000';
const DEFAULT_TODAY_BACKGROUD_COLOR = '#CCCCCC';

export function makeStyles(scaler, backgroundColor, textColor, todayBackgroundColor) {
  const SELECTED_BG_COLOR = backgroundColor ? backgroundColor : DEFAULT_SELECTED_BACKGROUND_COLOR;
  const SELECTED_TEXT_COLOR = textColor ? textColor : DEFAULT_SELECTED_TEXT_COLOR;
  const TODAY_BG_COLOR = todayBackgroundColor ? todayBackgroundColor : DEFAULT_TODAY_BACKGROUD_COLOR;
  return {
    calendar: {
      height: 320*scaler,
      marginTop: 10*scaler
    },

    dayButton: {
      width: 50*scaler,
      height: 40*scaler,
      alignSelf: 'center'
    },

    dayButtonSelected: {
      width: 30*scaler,
      height: 30*scaler,
      borderRadius: 15*scaler,
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: 'center'
    },

    dayLabel: {
      fontSize: 14*scaler,
      color: '#000',
      marginTop: 6*scaler,
      alignSelf: 'center'
    },

    selectedDayLabel: {
      color: SELECTED_TEXT_COLOR,
    },

    dayLabelsWrapper: {
      flexDirection: 'row',
      marginBottom: 10*scaler,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      paddingTop: 10*scaler,
      paddingBottom: 10*scaler,
      alignSelf: 'center',
      backgroundColor: 'rgba(0,0,0,0.0)',
      borderColor: 'rgba(0,0,0,0.2)'
    },

    daysWrapper: {
      alignSelf: 'center'
    },

    dayLabels: {
      width: 50*scaler,
      fontSize: 12*scaler,
      color: '#000',
      textAlign: 'center'
    },

    selectedDay: {
      width: 30*scaler,
      height:30*scaler,
      backgroundColor: SELECTED_BG_COLOR,
      borderRadius: 30*scaler,
      marginTop: -10*scaler,
      alignSelf: 'center'
    },

    selectedToday: {
      width: 30*scaler,
      height:30*scaler,
      backgroundColor: TODAY_BG_COLOR,
      borderRadius: 30*scaler,
      marginTop: -10*scaler,
      alignSelf: 'center'
    },

    dayWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50*scaler,
      height: 40*scaler,
      backgroundColor: 'rgba(0,0,0,0.0)'
    },

    startDayWrapper: {
      width: 50*scaler,
      height: 30*scaler,
      borderTopLeftRadius: 20*scaler,
      borderBottomLeftRadius: 20*scaler,
      backgroundColor: SELECTED_BG_COLOR,
      marginTop: -10*scaler,
      alignSelf: 'center',
    },

    endDayWrapper: {
      width: 50*scaler,
      height: 30*scaler,
      borderTopRightRadius: 20*scaler,
      borderBottomRightRadius: 20*scaler,
      backgroundColor: SELECTED_BG_COLOR,
      marginTop: -10*scaler,
      alignSelf: 'center',
    },

    inRangeDay: {
      width: 50*scaler,
      height: 30*scaler,
      backgroundColor: SELECTED_BG_COLOR,
      marginTop: -10*scaler,
      alignSelf: 'center',
    },

    monthLabel: {
      fontSize: 16*scaler,
      color: '#000',
      width: 180*scaler,
      textAlign: 'center'
    },

    headerWrapper: {
      alignItems: 'center',
      flexDirection: 'row',
      alignSelf: 'center',
      marginBottom: 10*scaler,
      padding: 5*scaler,
      paddingBottom: 3*scaler,
      backgroundColor: 'rgba(0,0,0,0.0)'
    },

    monthSelector: {
      width: 80*scaler
    },

    prev: {
      textAlign: 'left',
      fontSize: 14*scaler
    },

    next: {
      textAlign: 'right',
      fontSize: 14*scaler
    },

    yearLabel: {
      fontSize: 14*scaler,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center'
    },

    weeks: {
      flexDirection: 'column'
    },

    weekRow: {
      flexDirection: 'row'
    },

    disabledText: {
      fontSize: 14*scaler,
      color: '#BBBBBB',
      marginTop: -10,
      alignSelf: 'center'
    }
  };
}
