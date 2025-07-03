import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export type StatLineChartProps = {
  data: { date: string; value: number }[];
  label?: string;
  color?: string;
  dotColor?: string;
  height?: number;
  pointLabelFormatter?: (label: string) => string;
};

const StatLineChart: React.FC<StatLineChartProps> = ({
  data,
  label = 'Progress Over Time',
  color = 'white',
  dotColor = '#4FD6EA',
  height = 220,
  pointLabelFormatter = (label) => {
    const date = new Date(label);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }}
  ) => {
  const chartPadding = 50; // Buffer padding to give space at the end
  const pointSpacing = 60; // Customize spacing between each point

  const formattedLabels = data.map((entry) => pointLabelFormatter(entry.date));
  const formattedValues = data.map((entry) => entry.value);

  const chartWidth = data.length * pointSpacing + chartPadding;

  const chartConfig = {
    backgroundGradientFrom: '#2C3237',
    backgroundGradientTo: '#2C3237',
    color: () => color,
    labelColor: () => 'white',
    strokeWidth: 2,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: dotColor,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: formattedLabels,
            datasets: [{ data: formattedValues }],
          }}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          bezier
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          style={styles.chart}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginVertical: 12,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'center',
  },
  chart: {
    borderRadius: 8,
    marginHorizontal: 8,
  },
});

export default StatLineChart;
