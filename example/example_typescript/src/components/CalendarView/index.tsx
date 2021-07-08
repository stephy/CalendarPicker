import React, { Dispatch, SetStateAction, useState } from "react"
import {
    StyleSheet,
    View,
    Dimensions,
    Text
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Moment } from "moment";

import { week, monthFull } from "./config"
import { colors } from "../../global/colors";

interface CalendarViewProps {
    startDate: Date,
    setStartDate: Dispatch<SetStateAction<Date | null>>,
    endDate: Date,
    setEndDate: Dispatch<SetStateAction<Date | null>>,
    scroll?: boolean,
}

export function CalendarView(props: CalendarViewProps) {
    const [monthYearText] = useState(["Selecione o mês de ", "Selecione o ano "])

    const {
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        scroll = false
    } = props

    function onDateChange(date: Moment, type: 'START_DATE' | 'END_DATE') {
        if (type === 'END_DATE') {
            if (date) {
                setEndDate(date.toDate())
                return
            }
            setEndDate(null)
        }
        else {
            setEndDate(date.toDate())
            setStartDate(date.toDate())
        }
    }


    return (
        <View style={styles.container}>
            <CalendarPicker
                allowRangeSelection
                startFromMonday
                scrollable={scroll}
                onDateChange={onDateChange}
                weekdays={week}
                months={monthFull}
                previousTitle={`<`}
                nextTitle={`>`}
                previousTitleStyle={styles.fontSize}
                nextTitleStyle={styles.fontSize}
                headerWrapperStyle={styles.headerWrapper}

                selectedDayTextStyle={styles.selectedDayTextStyle}
                textStyle={styles.textStyle}
                selectedDayTextColor={colors.lightText}
                selectedRangeEndStyle={styles.selectedRangeEndStyle}
                selectedRangeEndTextStyle={styles.selectedRangeEndTextStyle}
                selectedRangeStartTextStyle={styles.selectedRangeStartTextStyle}
                selectedRangeStartStyle={[styles.selectedRangeStartStyle, {
                    backgroundColor: !!!endDate ? 'transparent' : colors.background_opacity,
                }]}
                selectedRangeStyle={[
                    styles.selectedRangeStyle,
                    {
                        backgroundColor: !startDate ? 'transparent' : colors.background_opacity,
                    }
                ]}

                monthYearHeaderWrapperStyle={styles.monthYear}
                monthTitleStyle={styles.fontSize}
                yearTitleStyle={styles.fontSize}
                todayBackgroundColor={colors.background_opacity}
                selectMonthTitle={monthYearText[0]}
                selectYearTitle={monthYearText[1]}
                minDate={new Date()}

                selectedEndDate={endDate}
                selectedStartDate={startDate}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    selectedDay: {
        backgroundColor: "black"
    },
    selectedRangeEndStyle: {
        backgroundColor: colors.background_opacity,
        width: Dimensions.get("screen").width * 0.134,
        paddingRight: Dimensions.get("screen").width * 0.12,
    },
    selectedRangeEndTextStyle: {
        color: colors.lightText,
        backgroundColor: colors.background,
        width: Dimensions.get("screen").width * 0.12,
        height: Dimensions.get("screen").height * 0.06,
        paddingTop: 14,
        textAlign: 'center',
        paddingVertical: 9,
        borderRadius: 50,
        position: "absolute",
        fontSize: 14,
        fontWeight: "700"
    },
    selectedRangeStartTextStyle: {
        color: colors.lightText,
        backgroundColor: colors.background,
        width: Dimensions.get("screen").width * 0.12,
        height: Dimensions.get("screen").height * 0.06,
        paddingTop: 14,
        textAlign: 'center',
        paddingVertical: 9,
        borderRadius: 50,
        position: "absolute",
        fontSize: 14,
        fontWeight: "700"
    },
    selectedRangeStartStyle: {
        width: Dimensions.get("screen").width * 0.134,
        paddingRight: Dimensions.get("screen").width * 0.12,
    },
    selectedRangeStyle: {
        height: '99%',
    },
    selectedDayTextStyle: {
        color: colors.darkText,
        fontSize: 14,
        fontWeight: "700"
    },
    textStyle: {
        fontSize: 14,
        fontWeight: "700"
    },
    fontSize: {
        fontSize: 22,
        fontWeight: "800"
    },
    headerWrapper: {
        paddingHorizontal: 20
    },
    monthYear: {
        position: "absolute",
        left: Dimensions.get("screen").width * 0.2,
    }
});
