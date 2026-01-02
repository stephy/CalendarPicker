import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { differenceInDays } from 'date-fns/differenceInDays';
import { isAfter } from 'date-fns/isAfter';
import { isBefore } from 'date-fns/isBefore';
import { isSameDay } from 'date-fns/isSameDay';
import { isWithinInterval } from 'date-fns/isWithinInterval';
import { startOfDay } from 'date-fns/startOfDay';

export default function Day(props) {
  const {
    day,
    month,
    year,
    styles,
    onPressDay,
    selectedStartDate,
    selectedEndDate,
    allowRangeSelection,
    allowBackwardRangeSelect,
    minDate,
    maxDate,
    disabledDates,
    minRangeDuration,
    maxRangeDuration,
    enableDateChange,
    textStyle,

    // 🔥 NEW
    rangeStyleProvider,
  } = props;

  const thisDay = new Date(year, month, day, 12);
  const today = new Date();

  const isStart = selectedStartDate && isSameDay(thisDay, selectedStartDate);
  const isEnd = selectedEndDate && isSameDay(thisDay, selectedEndDate);

  const isInRange =
    selectedStartDate &&
    selectedEndDate &&
    isWithinInterval(thisDay, {
      start: selectedStartDate,
      end: selectedEndDate,
    });

  const isMiddle = isInRange && !isStart && !isEnd;

  let isDisabled = false;

  if (minDate && isBefore(startOfDay(thisDay), startOfDay(minDate))) {
    isDisabled = true;
  }

  if (maxDate && isAfter(startOfDay(thisDay), startOfDay(maxDate))) {
    isDisabled = true;
  }

  if (disabledDates) {
    if (Array.isArray(disabledDates)) {
      isDisabled = disabledDates.includes(thisDay.valueOf());
    } else if (typeof disabledDates === 'function') {
      isDisabled = disabledDates(thisDay);
    }
  }

  // Range constraint
  if (allowRangeSelection && selectedStartDate && !selectedEndDate) {
    let diff = differenceInDays(thisDay, selectedStartDate);
    diff = allowBackwardRangeSelect ? Math.abs(diff) : diff;

    if (minRangeDuration && diff < minRangeDuration) isDisabled = true;
    if (maxRangeDuration && diff > maxRangeDuration) isDisabled = true;
  }

  const rangeStyle =
    rangeStyleProvider?.({
      isStart,
      isEnd,
      isMiddle,
      date: thisDay,
    }) || {};

  const renderRangeBackground = () => {
    if (!isInRange) return null;

    return (
      <View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: isStart ? '50%' : 0,
            right: isEnd ? '50%' : 0,
          },
          rangeStyle.backgroundStyle,
        ]}
      />
    );
  };

  return (
    <View style={styles.dayWrapper}>
      {renderRangeBackground()}

      <TouchableOpacity
        disabled={!enableDateChange || isDisabled}
        style={[styles.dayButton, rangeStyle.containerStyle]}
        onPress={() => onPressDay({ year, month, day })}
      >
        <Text style={[styles.dayLabel, textStyle, rangeStyle.textStyle]}>
          {day}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

Day.propTypes = {
  day: PropTypes.number,
  month: PropTypes.number,
  year: PropTypes.number,
  styles: PropTypes.object,
  onPressDay: PropTypes.func,
  selectedStartDate: PropTypes.instanceOf(Date),
  selectedEndDate: PropTypes.instanceOf(Date),
  allowRangeSelection: PropTypes.bool,
  allowBackwardRangeSelect: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  disabledDates: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  minRangeDuration: PropTypes.number,
  maxRangeDuration: PropTypes.number,
  enableDateChange: PropTypes.bool,
  textStyle: PropTypes.any,
  rangeStyleProvider: PropTypes.func,
};
