/**
 * Calendar Picker Component
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
const DEFAULT_SELECTED_BACKGROUND_COLOR = '#5ce600';
const DEFAULT_SELECTED_TEXT_COLOR = '#000000';
const DEFAULT_TODAY_BACKGROUND_COLOR = '#CCCCCC';

function getBorderRadiusByShape(scaler, dayShape) {
  if (dayShape === 'square') {
    return 0;
  } else {
    return 30*scaler;
  }
}

export function makeStyles(params) {
  const {
    containerWidth,
    containerHeight,
    scaleFactor,
    selectedDayColor,
    selectedDayTextColor,
    todayBackgroundColor,
    dayShape
  } = params;
  const scaler = Math.min(containerWidth, containerHeight) / scaleFactor;
  const SELECTED_BG_COLOR = selectedDayColor ? selectedDayColor : DEFAULT_SELECTED_BACKGROUND_COLOR;
  const SELECTED_TEXT_COLOR = selectedDayTextColor ? selectedDayTextColor : DEFAULT_SELECTED_TEXT_COLOR;
  const TODAY_BG_COLOR = todayBackgroundColor ? todayBackgroundColor : DEFAULT_TODAY_BACKGROUND_COLOR;

  return {
    containerWidth,
    containerHeight,

    calendar: {
      height: Math.floor(320*scaler),
      marginTop: Math.floor(10*scaler)
    },

    dayButton: {
      width: Math.floor(30*scaler),
      height: Math.floor(30*scaler),
      borderRadius: getBorderRadiusByShape(scaler, dayShape),
      alignSelf: 'center',
      justifyContent: 'center'
    },

    dayLabel: {
      fontSize: Math.floor(14*scaler),
      color: '#000',
      alignSelf: 'center'
    },

    selectedDayLabel: {
      color: SELECTED_TEXT_COLOR,
    },

    dayLabelsWrapper: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderTopWidth: 1,
      paddingTop: Math.floor(10*scaler),
      paddingBottom: Math.floor(10*scaler),
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.0)',
      borderColor: 'rgba(0,0,0,0.2)'
    },

    daysWrapper: {
      alignSelf: 'center',
      justifyContent: 'center'
    },

    dayLabels: {
      width: Math.floor(50*scaler),
      fontSize: Math.floor(12*scaler),
      color: '#000',
      textAlign: 'center'
    },

    selectedDay: {
      width: Math.floor(30*scaler),
      height:Math.floor(30*scaler),
      borderRadius: getBorderRadiusByShape(scaler, dayShape),
      alignSelf: 'center',
      justifyContent: 'center'
    },

    selectedDayBackground: {
      backgroundColor: SELECTED_BG_COLOR,
    },

    selectedToday: {
      width: Math.floor(30*scaler),
      height:Math.floor(30*scaler),
      backgroundColor: TODAY_BG_COLOR,
      borderRadius: getBorderRadiusByShape(scaler, dayShape),
      alignSelf: 'center',
      justifyContent: 'center'
    },

    dayWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      width: Math.floor(50*scaler),
      height: Math.floor(40*scaler),
      backgroundColor: 'rgba(0,0,0,0.0)'
    },

    startDayWrapper: {
      width: Math.floor(50*scaler),
      height: Math.floor(30*scaler),
      borderTopLeftRadius: Math.floor(20*scaler),
      borderBottomLeftRadius: Math.floor(20*scaler),
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    endDayWrapper: {
      width: Math.floor(50*scaler),
      height: Math.floor(30*scaler),
      borderTopRightRadius: Math.floor(20*scaler),
      borderBottomRightRadius: Math.floor(20*scaler),
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    inRangeDay: {
      width: Math.floor(50*scaler),
      height: Math.floor(30*scaler),
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    headerWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'space-between',
      width: containerWidth,
      padding: Math.floor(5*scaler),
      paddingBottom: Math.floor(3*scaler),
      marginBottom: Math.floor(10*scaler),
      backgroundColor: 'rgba(0,0,0,0.0)'
    },

    monthYearHeaderWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Math.floor(3*scaler),
    },

    previousContainer: {
      marginLeft: Math.floor(10*scaler),
    },

    nextContainer: {
      marginRight: Math.floor(10*scaler),
      alignItems: 'flex-end',
    },

    navButtonText: {
      fontSize: Math.floor(14*scaler),
    },

    weeks: {
      flexDirection: 'column'
    },

    weekRow: {
      flexDirection: 'row'
    },

    disabledText: {
      fontSize: Math.floor(14*scaler),
      color: '#BBBBBB',
      alignSelf: 'center',
      justifyContent: 'center'
    },

    selectedDisabledText: {
      fontSize: Math.floor(14*scaler),
      color: '#DDDDDD',
      alignSelf: 'center',
      justifyContent: 'center'
    },

    monthHeaderMainText: {
      fontSize: Math.floor(16*scaler),
      color: '#000',
      textAlign: 'right',
      marginHorizontal: Math.floor(3*scaler),
    },

    monthButton: {
      width: Math.floor(30*scaler),
      height: Math.floor(30*scaler),
      borderRadius: Math.floor(30*scaler),
      alignSelf: 'center',
      justifyContent: 'center'
    },

    monthsHeaderText: {
      flex: 1,
      fontSize: Math.floor(16*scaler),
      color: '#000',
      textAlign: 'center'
    },

    monthContainer: {
      flex: 1,
      alignItems: 'center',
    },

    monthText: {
      fontSize: Math.floor(14*scaler),
      color: '#000',
      alignSelf: 'center'
    },

    monthsWrapper: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: containerWidth,
    },

    monthsRow: {
      flexDirection: 'row',
      padding: Math.floor(20*scaler),
    },

    yearHeaderMainText: {
      fontSize: Math.floor(16*scaler),
      color: '#000',
      marginHorizontal: Math.floor(3*scaler),
    },

    yearContainer: {
      flex: 1,
      alignItems: 'center',
    },

    yearText: {
      fontSize: Math.floor(14*scaler),
      color: '#000',
      alignSelf: 'center'
    },

    yearsHeaderText: {
      fontSize: Math.floor(16*scaler),
      color: '#000',
      width: Math.floor(180*scaler),
      textAlign: 'center'
    },

    yearsWrapper: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: containerWidth,
    },

    yearsRow: {
      flexDirection: 'row',
      padding: Math.floor(20*scaler),
    },

  };
}
