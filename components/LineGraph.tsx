import React, { useState } from 'react';
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
  },
}) => {
  const chartPadding = 100;
  const pointSpacing = 60;
  const chartWidth = data.length * pointSpacing + chartPadding;

  const formattedLabels = data.map((entry) => pointLabelFormatter(entry.date));
  const formattedValues = data.map((entry) => entry.value);

  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
    value: number | null;
    index: number | null;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    value: null,
    index: null,
    visible: false,
  });

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingRight: 60 }}>
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
          onDataPointClick={(data) => {
            const isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;

            setTooltipPos((prev) => ({
              ...prev,
              x: data.x,
              y: data.y,
              value: data.value,
              index: data.index,
              visible: !isSamePoint || !prev.visible,
            }));
          }}
          decorator={() => {
            if (!tooltipPos.visible || tooltipPos.value === null) return null;
          
            return (
              <View
                style={{
                  position: 'absolute',
                  left: tooltipPos.x - 30,
                  top: tooltipPos.y - 40,
                  backgroundColor: '#333',
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                  borderRadius: 6,
                  zIndex: 9999,
                }}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>{tooltipPos.value}</Text>
              </View>
            );
          }}
          
        />
      </ScrollView>
      <Text style={styles.subscript}>*Latest Value: {label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    width: '100%',
  },
  chart: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 0,
  },
  subscript: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
    alignSelf: 'center'
  }
});

export default StatLineChart;
