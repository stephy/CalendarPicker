import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

import { differenceInDays } from "date-fns/differenceInDays";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { isSameDay } from "date-fns/isSameDay";
import { isWithinInterval } from "date-fns/isWithinInterval";
import { startOfDay } from "date-fns/startOfDay";

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
  let isOnlyMiddleDay = false; // Chỉ có 1 ngày ở giữa

  if (allowRangeSelection && sortedStartDate && sortedEndDate) {
    if (isSameDay(sortedStartDate, sortedEndDate)) {
      isSingleDayRange = true;
    } else if (isThisDaySameAsSelectedStart) {
      isFirstDayOfRange = true;
    } else if (isThisDaySameAsSelectedEnd) {
      isLastDayOfRange = true;
    } else if (isThisDateInSelectedRange) {
      isMiddleDayOfRange = true;

      // Kiểm tra nếu đây là ngày duy nhất ở giữa
      const daysBetween = Math.abs(
        differenceInDays(sortedStartDate, sortedEndDate)
      );
      if (daysBetween === 2) {
        isOnlyMiddleDay = true;
      }
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

    // ========== STYLE VIÊN THUỐC DÀI ==========
    if (allowRangeSelection) {
      if (selectedStartDate && selectedEndDate) {
        // 1. NGÀY ĐẦU - HÌNH TRÒN, DÍNH VỚI VIÊN THUỐC
        if (isFirstDayOfRange) {
          computedSelectedDayStyle = [
            styles.startDayWrapper,
            selectedRangeStyle,
            selectedRangeStartStyle,
          ];

          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              backgroundColor: "#007AFF", // MÀU ĐẬM
              borderRadius: 20, // Hình tròn
              width: 40,
              height: 40,
              marginLeft: 0,
              marginRight: 0, // KHÔNG margin âm
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              position: "relative",
              // Tạo hiệu ứng dính bằng pseudo element
            },
          ];

          // Thêm phần mở rộng để dính với viên thuốc
          const dayWrapperStyle = {
            position: "relative",
            overflow: "visible",
          };

          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            selectedRangeStartTextStyle,
            { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
          ];

          // Render với phần mở rộng
          if (!dateOutOfRange) {
            return (
              <View
                style={[
                  styles.dayWrapper,
                  custom.containerStyle,
                  dayWrapperStyle,
                ]}
              >
                {/* Phần mở rộng bên phải để dính với viên thuốc */}
                <View
                  style={{
                    position: "absolute",
                    left: 35, // Bắt đầu từ cạnh phải của hình tròn
                    top: 0,
                    width: 20, // Độ rộng phần dính
                    height: 40,
                    backgroundColor: "#E3F2FD", // Màu viên thuốc
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    zIndex: 10,
                  }}
                />

                <TouchableOpacity
                  disabled={!enableDateChange}
                  style={[
                    custom.style,
                    computedSelectedDayStyle,
                    selectedDayStyle,
                  ]}
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
        }

        // 2. NGÀY CUỐI - HÌNH TRÒN, DÍNH VỚI VIÊN THUỐC
        if (isLastDayOfRange) {
          computedSelectedDayStyle = [
            styles.endDayWrapper,
            selectedRangeStyle,
            selectedRangeEndStyle,
          ];

          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              backgroundColor: "#007AFF", // MÀU ĐẬM
              borderRadius: 20, // Hình tròn
              width: 40,
              height: 40,
              marginLeft: 0,
              marginRight: 0, // KHÔNG margin âm
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              position: "relative",
            },
          ];

          const dayWrapperStyle = {
            position: "relative",
            overflow: "visible",
          };

          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            selectedRangeEndTextStyle,
            { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
          ];

          // Render với phần mở rộng
          if (!dateOutOfRange) {
            return (
              <View
                style={[
                  styles.dayWrapper,
                  custom.containerStyle,
                  dayWrapperStyle,
                ]}
              >
                {/* Phần mở rộng bên trái để dính với viên thuốc */}
                <View
                  style={{
                    position: "absolute",
                    right: 35, // Bắt đầu từ cạnh trái của hình tròn
                    top: 0,
                    width: 20, // Độ rộng phần dính
                    height: 40,
                    backgroundColor: "#E3F2FD", // Màu viên thuốc
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    zIndex: 10,
                  }}
                />

                <TouchableOpacity
                  disabled={!enableDateChange}
                  style={[
                    custom.style,
                    computedSelectedDayStyle,
                    selectedDayStyle,
                  ]}
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
        }

        // 3. CÁC NGÀY Ở GIỮA - TẠO THÀNH VIÊN THUỐC DÀI
        if (isMiddleDayOfRange) {
          computedSelectedDayStyle = [styles.inRangeDay, selectedRangeStyle];

          // Tính toán width dựa trên số ngày
          let middleDayWidth = "auto";
          let middleDayFlex = 1;

          // Nếu chỉ có 1 ngày ở giữa, tạo hình viên thuốc nhỏ
          if (isOnlyMiddleDay) {
            middleDayWidth = 60; // Width cố định cho viên thuốc nhỏ
            middleDayFlex = 0;
          }

          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              backgroundColor: "#E3F2FD", // MÀU VIÊN THUỐC
              borderRadius: 20, // Bo tròn đều - hình viên thuốc
              height: 40,
              marginLeft: 0, // KHÔNG margin âm
              marginRight: 0, // KHÔNG margin âm
              flex: middleDayFlex,
              width: middleDayWidth,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 15,
              // Kéo dài để che khoảng trống
              transform: [{ scaleX: 1.1 }], // Kéo rộng ra 10%
            },
          ];

          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            { color: "#000000", fontWeight: "normal", fontSize: 14 },
          ];

          // Override dayWrapper để các viên thuốc dính nhau
          const dayWrapperStyle = {
            flex: 1,
            marginHorizontal: -2, // Âm nhẹ để dính
            zIndex: 15,
          };

          if (!dateOutOfRange) {
            return (
              <View
                style={[
                  styles.dayWrapper,
                  custom.containerStyle,
                  dayWrapperStyle,
                ]}
              >
                <TouchableOpacity
                  disabled={!enableDateChange}
                  style={[
                    custom.style,
                    computedSelectedDayStyle,
                    selectedDayStyle,
                  ]}
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
        }

        // 4. NGÀY DUY NHẤT ĐƯỢC CHỌN (start = end) - HÌNH TRÒN
        if (isSingleDayRange) {
          computedSelectedDayStyle = [
            styles.selectedDay,
            styles.selectedDayBackground,
            selectedRangeStyle,
          ];

          computedSelectedDayStyle = [
            ...computedSelectedDayStyle,
            {
              backgroundColor: "#007AFF",
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            },
          ];

          selectedDayTextStyle = [
            styles.selectedDayLabel,
            propSelectedDayTextStyle,
            selectedRangeStartTextStyle,
            { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
          ];
        }

        // DEBUG
        console.log("Day:", day, {
          isFirst: isFirstDayOfRange,
          isLast: isLastDayOfRange,
          isMiddle: isMiddleDayOfRange,
          isOnlyMiddle: isOnlyMiddleDay,
        });
      }

      // 5. KHI CHỈ MỚI CHỌN START DATE
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
            backgroundColor: "#007AFF",
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          },
        ];

        selectedDayTextStyle = [
          styles.selectedDayLabel,
          propSelectedDayTextStyle,
          selectedRangeStartTextStyle,
          { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
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
