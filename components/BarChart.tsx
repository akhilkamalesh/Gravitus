import React from "react";
import { Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

type WeeklyWorkoutData = { date: string; count: number }[];

type Props = {
  data: WeeklyWorkoutData;
  width?: number;
};

const screenWidth = Dimensions.get("window").width;

export default function WeeklyWorkoutBarChart({ data, width = screenWidth * 0.85 }: Props) {
  const labels = data.map((item) => {
    const d = new Date(item.date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const counts = data.map((item) => item.count);

  return (
    <View>
      <BarChart
        data={{
          labels,
          datasets: [{ data: counts }],
        }}
        width={width}
        height={180}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "transparent",
          backgroundGradientFrom: '#2C3237',
          backgroundGradientTo: '#2C3237',
          decimalPlaces: 0,
          barPercentage: 0.6,
          color: (opacity = 1) => `#4FD6EA`,
          labelColor: (opacity = 1) => `rgba(204, 204, 204, ${opacity})`,
        }}
        verticalLabelRotation={0}
        fromZero
        withInnerLines={false}
        showValuesOnTopOfBars
        style={{
          marginTop: 20,
          marginBottom: 20,
          marginRight: 20,
          marginLeft: -10
        }} yAxisSuffix={""}      />
    </View>
  );
}
