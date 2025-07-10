import React from "react";
import { BarChart } from "react-native-chart-kit";
import { Dimensions, StyleSheet, Text, View } from "react-native";

type WeeklyWorkoutData = { date: string; count: number }[];

type Props = {
  data: WeeklyWorkoutData;
  width?: number;
};

const screenWidth = Dimensions.get("window").width;

export default function WeeklyWorkoutBarChart({ data, width = screenWidth * 0.90 }: Props) {
  const labels = data.map((item) => {
    const d = new Date(item.date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const counts = data.map((item) => item.count);

  return (
    <View style={styles.viewContainer}>
      <BarChart
        data={{
          labels,
          datasets: [{ data: counts }],
        }}
        width={width}
        height={180}
        yAxisLabel=""
        chartConfig={{
          backgroundGradientFrom: '#2C3237',
          backgroundGradientTo: '#2C3237',
          decimalPlaces: 0,
          barPercentage: 0.7,
          color: (opacity = 1) => `#4FD6EA`,
          labelColor: (opacity = 1) => `rgba(204, 204, 204, ${opacity})`,
        }}
        verticalLabelRotation={0}
        fromZero
        withInnerLines={false}
        showValuesOnTopOfBars
        style={{
          borderRadius: 5,
        }} yAxisSuffix={""}      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: 'flex-start',
    width: '100%',
  }
})
