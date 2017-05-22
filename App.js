import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import CalendarPicker from "./CalendarPicker";

const MONTHS_ZH = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月"
];
const WEEKDAYS_ZH = ["日", "一", "二", "三", "四", "五", "六"];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date, type) {
    if (type === "END_DATE") {
      this.setState({
        selectedEndDate: date
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null
      });
    }
  }
  render() {
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : "";
    return (
      <View style={styles.container}>
        <CalendarPicker
          headerStyle={{
            backgroundColor: "#3aa8c8",
            height: 25 * 2,
            marginBottom: 0
          }}
          headerTextStyle={{
            color: "white"
          }}
          headerMidTextStyle={{
            fontSize: 12 * 2,
            fontWeight: "500",
            letterSpacing: -0.13 * 2,
            textAlign: "center",
            color: "white"
          }}
          headerSideTextStyle={{
            height: 8.5 * 2,
            fontSize: 7 * 2,
            fontWeight: "500",
            letterSpacing: -0.08 * 2,
            textAlign: "center",
            color: "white"
          }}
          weekDaysStyle={{
            borderBottomWidth: 0
          }}
          weekDaysTextStyle={{
            fontSize: 9 * 2,
            fontWeight: "bold",
            letterSpacing: -0.1 * 2,
            textAlign: "center",
            color: "#2caba6"
          }}
          previousTitle="上月"
          nextTitle="下月"
          allowRangeSelection
          onDateChange={this.onDateChange}
          markedDays={["2017/5/10", "2017/5/1"]}
          selectedMarkedDaysColorStyle={{ backgroundColor: "red" }}
          selectedMarkedDaysTextColorStyle={{ color: "#fff" }}
          months={MONTHS_ZH}
          weekdays={WEEKDAYS_ZH}
        />

        <View>
          <Text>SELECTED DATE:{startDate}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 100
  }
});
