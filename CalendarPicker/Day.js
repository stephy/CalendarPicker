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

  // Đảm bảo thứ tự đúng
  let sortedStartDate = selectedStartDate;
  let sortedEndDate = selectedEndDate;
  if (
    selectedStartDate &&
    selectedEndDate &&
    selectedStartDate > selectedEndDate
  ) {
    sortedStartDate = selectedEndDate;
    sortedEndDate = selectedStartDate;
    isThisDaySameAsSelectedStart = isSameDay(thisDay, sortedStartDate);
    isThisDaySameAsSelectedEnd = isSameDay(thisDay, sortedEndDate);
  }

  let isThisDateInSelectedRange =
    sortedStartDate &&
    sortedEndDate &&
    isWithinInterval(thisDay, {
      start: sortedStartDate,
      end: sortedEndDate,
    });

  // Xác định vị trí ngày trong range
  let isFirstDayOfRange = false;
  let isLastDayOfRange = false;
  let isMiddleDayOfRange = false;
  let isSingleDayRange = false;

  if (allowRangeSelection && sortedStartDate && sortedEndDate) {
    if (isSameDay(sortedStartDate, sortedEndDate)) {
      isSingleDayRange = true;
    } else if (isThisDaySameAsSelectedStart) {
      isFirstDayOfRange = true;
    } else if (isThisDaySameAsSelectedEnd) {
      isLastDayOfRange = true;
    } else if (isThisDateInSelectedRange) {
      isMiddleDayOfRange = true;
    }
  }

  // If date is in range let's apply styles
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

    // set selected day style
    if (
      !allowRangeSelection &&
      selectedStartDate &&
      isThisDaySameAsSelectedStart
    ) {
      computedSelectedDayStyle = styles.selectedDay;
      selectedDayTextStyle = [
        styles.selectedDayLabel,
        isToday && todayTextStyle,
        propSelectedDayTextStyle,
      ];
      selectedDayStyle = propSelectedDayStyle || styles.selectedDayBackground;
    }

    // ========== HARD CODE STYLE CHO RANGE SELECTION ==========
    if (allowRangeSelection) {
      if (selectedStartDate && selectedEndDate) {
        // NGÀY ĐẦU (2) - BO TRÒN HOÀN TOÀN BÊN TRÁI
        if (isFirstDayOfRange) {
          computedSelectedDayStyle = [
            styles.startDayWrapper,
            selectedRangeStyle,
            selectedRangeStartStyle,
          ];

          // HARD CODE STYLE: Bo tròn hoàn toàn bên trái
          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              backgroundColor: '#0A2B40', // MÀU XANH - THAY ĐỔI THEO THIẾT KẾ
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
              width: 40,
              height: 40,
              marginLeft: 0,
              marginRight: -5,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            },
          ];

          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            selectedRangeStartTextStyle,
            { color: '#FFFFFF', fontWeight: 'bold' },
          ];
        }

        // NGÀY CUỐI (9) - BO TRÒN HOÀN TOÀN BÊN PHẢI
        if (isLastDayOfRange) {
          computedSelectedDayStyle = [
            styles.endDayWrapper,
            selectedRangeStyle,
            selectedRangeEndStyle,
          ];

          // HARD CODE STYLE: Bo tròn hoàn toàn bên phải
          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              backgroundColor: '#0A2B40', // MÀU XANH - THAY ĐỔI THEO THIẾT KẾ
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              width: 40,
              height: 40,
              marginLeft: -5, // Âm để dính vào ngày trước
              marginRight: 0,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            },
          ];

          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            selectedRangeEndTextStyle,
            { color: '#FFFFFF', fontWeight: 'bold' },
          ];
        }

        // CÁC NGÀY Ở GIỮA (3-8) - BO NHẸ, DÍNH SÁT
        if (isMiddleDayOfRange) {
          computedSelectedDayStyle = [styles.inRangeDay, selectedRangeStyle];

          // HARD CODE STYLE: Bo nhẹ, margin âm để dính sát
          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              backgroundColor: '#BFD7E8', // MÀU NỀN NHẠT - THAY ĐỔI THEO THIẾT KẾ
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
              height: 40,
              marginLeft: -5,
              marginRight: -5,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
            },
          ];

          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            { color: '#000000', fontWeight: 'normal' },
          ];
        }

        // NGÀY DUY NHẤT ĐƯỢC CHỌN (start = end)
        if (isSingleDayRange) {
          computedSelectedDayStyle = [
            styles.selectedDay,
            styles.selectedDayBackground,
            selectedRangeStyle,
          ];

          // HARD CODE STYLE: Bo tròn hoàn toàn
          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              backgroundColor: '#007AFF',
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ];

          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            selectedRangeStartTextStyle,
            { color: '#FFFFFF', fontWeight: 'bold' },
          ];
        }
      }

      // KHI CHỈ MỚI CHỌN START DATE
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

        // HARD CODE STYLE: Bo tròn hoàn toàn
        computedSelectedDayStyle = [
          ...computedSelectedDayStyle,
          {
            backgroundColor: '#007AFF',
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ];

        selectedDayTextStyle = [
          styles.selectedDayLabel,
          propSelectedDayTextStyle,
          selectedRangeStartTextStyle,
          { color: '#FFFFFF', fontWeight: 'bold' },
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
