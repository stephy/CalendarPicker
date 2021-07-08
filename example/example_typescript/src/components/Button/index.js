import React, { useCallback, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { Button } from './src/components/Button';
import { CalendarView } from './src/components/CalendarView';
import { colors } from './src/global/colors';

// Types erros will be fix when "react-native-calendar-picker" accepts PR

export default function App() {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date())
  const [selectedEndDate, setSelectedEndDate] = useState()

  const incrementTimeBy = useCallback(
    (time) => {
      try {
        if (!!selectedEndDate) {
          const actualEndDate = new Date(selectedEndDate)
          actualEndDate.setDate(actualEndDate.getDate() + time)
          setSelectedEndDate(actualEndDate)
        }
      }
      catch (e) {
        if (__DEV__) console.log("Error incrementTimeBy:", e)
      }
    },
    [selectedEndDate, selectedStartDate],
  )


  const clearAll = useCallback(
    () => {
      setSelectedEndDate(null)
      setSelectedStartDate(new Date())
    },
    [],
  )

  return (
    <SafeAreaView style={styles.container}>

      <CalendarView
        endDate={selectedEndDate}
        startDate={selectedStartDate}
        setStartDate={setSelectedStartDate}
        setEndDate={setSelectedEndDate}
      />

      <View style={styles.main}>
        <View style={styles.divider} />

        <View style={[styles.selectOptions, { opacity: !!selectedEndDate ? 1 : 0.8 }]}>
          <View style={styles.row}>
            <Button
              onPress={() => incrementTimeBy(1)}
              text={"Add one"}
            />
            <Button
              onPress={() => incrementTimeBy(3)}
              text={"Add three"}
            />
            <Button
              onPress={() => incrementTimeBy(7)}
              text={"Add seven"}
            />
          </View>
        </View>

        <View style={styles.textShow}>
          <View>
            <Text style={styles.text}>
              Start date: {selectedStartDate?.toDateString()}
            </Text>

            <Text style={styles.text}>
              End date: {selectedEndDate?.toDateString()}
            </Text>
          </View>

          <Button
            line
            style={styles.customButton}
            showIcon={false}
            text={"LIMPAR"}
            onPress={() => clearAll()}
          />

        </View>
      </View>


    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50
  },
  selectOptions: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  main: {
    marginHorizontal: 20,
    paddingVertical: 15
  },
  divider: {
    width: "100%",
    backgroundColor: colors.background,
    height: 1,
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: 'space-around'
  },
  textShow: {
    marginVertical: 30,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  text: {
    fontSize: 14,
    fontWeight: "700"
  },
  customButton: {
    backgroundColor: "transparent",
    borderColor: colors.background,
    borderWidth: 1,
    borderRadius: 5
  }
});
