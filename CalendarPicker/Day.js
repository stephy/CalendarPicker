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
    customDatesStyles = [],
    onPressDay,
    selectedStartDate,
    selectedEndDate,
    allowRangeSelection,
    allowBackwardRangeSelect,
    selectedDayStyle: propSelectedDayStyle,
    selectedDisabledDatesTextStyle,
    selectedRangeStartStyle,
    selectedRangeStyle,
    selectedRangeEndStyle,
    textStyle,
    todayTextStyle,
    selectedDayTextStyle: propSelectedDayTextStyle,
    selectedRangeStartTextStyle,
    selectedRangeEndTextStyle,
    minDate,
    maxDate,
    disabledDates,
    disabledDatesTextStyle,
    minRangeDuration,
    maxRangeDuration,
    enableDateChange,
  } = props;

  const thisDay = new Date(year, month, day, 12);
  const today = new Date();

  let dateOutOfRange;
  let computedSelectedDayStyle = styles.dayButton;
  let selectedDayTextStyle = {};
  let selectedDayStyle;
  let overrideOutOfRangeTextStyle;
  let dateIsBeforeMin = false;
  let dateIsAfterMax = false;
  let dateIsDisabled = false;
  let dateRangeLessThanMin = false;
  let dateRangeGreaterThanMax = false;

  if (maxDate) {
    dateIsAfterMax = isAfter(startOfDay(thisDay), startOfDay(maxDate));
  }
  if (minDate) {
    dateIsBeforeMin = isBefore(startOfDay(thisDay), startOfDay(minDate));
  }

  if (disabledDates) {
    if (
      Array.isArray(disabledDates) &&
      disabledDates.indexOf(thisDay.valueOf()) >= 0
    ) {
      dateIsDisabled = true;
    } else if (disabledDates instanceof Function) {
      dateIsDisabled = disabledDates(thisDay);
    }
  }

  if (allowRangeSelection && selectedStartDate && !selectedEndDate) {
    let daysDiff = differenceInDays(thisDay, selectedStartDate);
    daysDiff = allowBackwardRangeSelect ? Math.abs(daysDiff) : daysDiff;

    if (maxRangeDuration) {
      if (Array.isArray(maxRangeDuration)) {
        let maxRangeEntry = maxRangeDuration.find((mrd) =>
          isSameDay(selectedStartDate, mrd.date)
        );
        if (maxRangeEntry && daysDiff > maxRangeEntry.maxDuration) {
          dateRangeGreaterThanMax = true;
        }
      } else if (daysDiff > maxRangeDuration) {
        dateRangeGreaterThanMax = true;
      }
    }

    if (minRangeDuration) {
      if (Array.isArray(minRangeDuration)) {
        let minRangeEntry = minRangeDuration.find((mrd) =>
          isSameDay(selectedStartDate, mrd.date)
        );
        if (minRangeEntry && daysDiff < minRangeEntry.minDuration) {
          dateRangeLessThanMin = true;
        }
      } else if (daysDiff < minRangeDuration) {
        dateRangeLessThanMin = true;
      }
    }

    if (!allowBackwardRangeSelect && daysDiff < 0) {
      dateRangeLessThanMin = true;
    }
  }

  dateOutOfRange =
    dateIsAfterMax ||
    dateIsBeforeMin ||
    dateIsDisabled ||
    dateRangeLessThanMin ||
    dateRangeGreaterThanMax;

  let isThisDaySameAsSelectedStart = isSameDay(thisDay, selectedStartDate);
  let isThisDaySameAsSelectedEnd = isSameDay(thisDay, selectedEndDate);
  let isThisDateInSelectedRange =
    selectedStartDate &&
    selectedEndDate &&
    isWithinInterval(thisDay, {
      start: selectedStartDate,
      end: selectedEndDate,
    });

  if (
    !dateOutOfRange ||
    isThisDaySameAsSelectedStart ||
    isThisDaySameAsSelectedEnd ||
    isThisDateInSelectedRange
  ) {
    let isToday = isSameDay(thisDay, today);
    if (isToday) {
      computedSelectedDayStyle = styles.selectedToday;
      selectedDayTextStyle = [todayTextStyle];
    }

    const custom = getCustomDateStyle({ customDatesStyles, date: thisDay });

    if (isToday && custom.style) {
      computedSelectedDayStyle = [styles.selectedToday, custom.style];
    }

    if (
      !allowRangeSelection &&
      selectedStartDate &&
      isThisDaySameAsSelectedStart
    ) {
      computedSelectedDayStyle = styles.selectedDay;
      computedSelectedDayStyle = [
        ...computedSelectedDayStyle,
        {
          borderRadius: 20,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 0,
        },
      ];

      selectedDayTextStyle = [
        styles.selectedDayLabel,
        isToday && todayTextStyle,
        propSelectedDayTextStyle,
      ];
      selectedDayStyle = propSelectedDayStyle || styles.selectedDayBackground;
    }

    if (allowRangeSelection) {
      if (selectedStartDate && selectedEndDate) {
        if (isThisDaySameAsSelectedStart) {
          computedSelectedDayStyle = [
            styles.startDayWrapper,
            selectedRangeStyle,
            selectedRangeStartStyle,
          ];
          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 0,
              backgroundColor: '#0A2B40',
            },
          ];
          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            selectedRangeStartTextStyle,
            { color: '#FFFFFF' },
          ];
        }

        if (isThisDaySameAsSelectedEnd) {
          computedSelectedDayStyle = [
            styles.endDayWrapper,
            selectedRangeStyle,
            selectedRangeEndStyle,
          ];
          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 0,
              backgroundColor: '#0A2B40',
            },
          ];
          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            selectedRangeEndTextStyle,
            { color: '#FFFFFF' },
          ];
        }

        if (
          isThisDaySameAsSelectedEnd &&
          isThisDaySameAsSelectedStart &&
          isSameDay(selectedEndDate, selectedStartDate)
        ) {
          computedSelectedDayStyle = [
            styles.selectedDay,
            styles.selectedDayBackground,
            selectedRangeStyle,
          ];
          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 0,
            },
          ];
          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            selectedRangeStartTextStyle,
          ];
        }

        if (
          !isThisDaySameAsSelectedEnd &&
          !isThisDaySameAsSelectedStart &&
          isWithinInterval(thisDay, {
            start: selectedStartDate,
            end: selectedEndDate,
          })
        ) {
          computedSelectedDayStyle = [styles.inRangeDay, selectedRangeStyle];
          computedSelectedDayStyle = [...computedSelectedDayStyle, {
            backgroundColor: '#BFD7E8', 
            borderRadius: 20,
            height: 40,
            width: 100,
            zIndex: 1,
          }];
          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            { color: '#023A5C' },
          ];
        }
      }

      if (
        selectedStartDate &&
        !selectedEndDate &&
        isThisDaySameAsSelectedStart
      ) {
        computedSelectedDayStyle = [
          styles.startDayWrapper,
          selectedRangeStyle,
          selectedRangeStartStyle,
        ];
        computedSelectedDayStyle = [
          ...computedSelectedDayStyle,
          {
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 0,
          },
        ];
        selectedDayTextStyle = [
          styles.selectedDayLabel,
          propSelectedDayTextStyle,
          selectedRangeStartTextStyle,
        ];
        overrideOutOfRangeTextStyle = selectedRangeStartTextStyle;
      }
    }

    if (dateOutOfRange) {
      return (
        <View style={[styles.dayWrapper, custom.containerStyle]}>
          <View
            style={[custom.style, computedSelectedDayStyle, selectedDayStyle]}
          >
            <Text
              style={[
                styles.dayLabel,
                textStyle,
                styles.disabledText,
                disabledDatesTextStyle,
                styles.selectedDisabledText,
                selectedDisabledDatesTextStyle,
                overrideOutOfRangeTextStyle,
              ]}
            >
              {day}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.dayWrapper, custom.containerStyle]}>
          <TouchableOpacity
            disabled={!enableDateChange}
            style={[custom.style, computedSelectedDayStyle, selectedDayStyle]}
            onPress={() => onPressDay({ year, month, day })}
          >
            <Text
              style={[
                styles.dayLabel,
                textStyle,
                custom.textStyle,
                selectedDayTextStyle,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  } else {
    const custom = getCustomDateStyle({ customDatesStyles, date: thisDay });
    if (!custom.allowDisabled) {
      custom.containerStyle = null;
      custom.style = null;
      custom.textStyle = null;
    }
    return (
      <View style={[styles.dayWrapper, custom.containerStyle]}>
        <View style={[styles.dayButton, custom.style]}>
          <Text
            style={[
              textStyle,
              styles.disabledText,
              disabledDatesTextStyle,
              custom.textStyle,
            ]}
          >
            {day}
          </Text>
        </View>
      </View>
    );
  }
}

function getCustomDateStyle({ customDatesStyles, date }) {
  if (Array.isArray(customDatesStyles)) {
    for (let cds of customDatesStyles) {
      if (isSameDay(date, new Date(cds.date))) {
        return { ...cds };
      }
    }
  } else if (customDatesStyles instanceof Function) {
    let cds = customDatesStyles(date) || {};
    return { ...cds };
  }
  return {};
}

Day.propTypes = {
  styles: PropTypes.shape({}),
  day: PropTypes.number,
  onPressDay: PropTypes.func,
  disabledDates: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  minRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  maxRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
};
