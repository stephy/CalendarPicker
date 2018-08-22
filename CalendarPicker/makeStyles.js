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
      width: 35*scaler,
      height: 35*scaler,
      borderRadius: 3*scaler,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.25)',
      alignSelf: 'center',
      justifyContent: 'center'
    },

    dayLabel: {
      fontSize: 13*scaler,
      fontWeight: 'bold',
      letterSpacing: 0.15,
      color: '#FFF',
      alignSelf: 'center'
    },

    selectedDayLabel: {
      color: SELECTED_TEXT_COLOR,
    },

    dayLabelsWrapper: {
      width: '100%',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.25)',
      // borderTopWidth: 1,
      paddingTop: 7*scaler,
      paddingBottom: 7*scaler,
      alignSelf: 'center',
      justifyContent: 'center',
      // backgroundColor: 'rgba(0,0,0,0.0)',
      // borderColor: 'rgba(0,0,0,0.2)'
    },

    daysWrapper: {
      alignSelf: 'center',
      justifyContent: 'center'
    },

    dayLabels: {
      width: 49*scaler,
      fontSize: 14*scaler,
      color: '#FFF',
      letterSpacing: 0.2,
      fontWeight: '500',
      fontFamily: 'Montserrat',
      textAlign: 'center'
    },

    selectedDay: {
      width: 30*scaler,
      height:30*scaler,
      borderRadius: 30*scaler,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    selectedDayBackground: {
      backgroundColor: SELECTED_BG_COLOR,
    },

    selectedToday: {
      // width: 30*scaler,
      // height:30*scaler,
      // backgroundColor: TODAY_BG_COLOR,
      // borderRadius: 30*scaler,
      // alignSelf: 'center',
      // justifyContent: 'center'
      width: 35*scaler,
      height: 35*scaler,
      borderRadius: 3*scaler,
      // borderWidth: 1,
      // borderColor: 'rgba(255,255,255,0.25)',
      backgroundColor: '#FFF',
      alignSelf: 'center',
      justifyContent: 'center'
    },

    dayWrapper: {
      margin: 7*scaler,
      alignItems: 'center',
      justifyContent: 'center',
      width: 35*scaler,
      height: 35*scaler,
      backgroundColor: 'rgba(0,0,0,0.0)'
    },

    startDayWrapper: {
      width: 50*scaler,
      height: 30*scaler,
      borderTopLeftRadius: 20*scaler,
      borderBottomLeftRadius: 20*scaler,
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    endDayWrapper: {
      width: 50*scaler,
      height: 30*scaler,
      borderTopRightRadius: 20*scaler,
      borderBottomRightRadius: 20*scaler,
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    inRangeDay: {
      width: 50*scaler,
      height: 30*scaler,
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    monthLabel: {
      fontSize: 16*scaler,
      color: '#000',
      marginBottom: 10*scaler,
      width: 180*scaler,
      textAlign: 'center'
    },

    headerWrapper: {
      alignItems: 'center',
      flexDirection: 'row',
      alignSelf: 'center',
      padding: 5*scaler,
      paddingBottom: 3*scaler,
      backgroundColor: 'rgba(0,0,0,0.0)'
    },

    monthSelector: {
      marginBottom: 10*scaler,
      fontSize: 14*scaler,
      width: 80*scaler
    },

    prev: {
      textAlign: 'left'
    },

    next: {
      textAlign: 'right'
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
      alignSelf: 'center',
      justifyContent: 'center'
    }
  };
}
