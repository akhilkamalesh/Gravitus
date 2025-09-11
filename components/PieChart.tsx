import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// TODO: Create map for muscle group to colors with similar groups being colored similar shades

const colors = [
    '#4FD6EA', // Vibrant cyan (base)
    '#EA4F9C', // Muted magenta-pink
    '#A17DF0', // Muted lavender-purple
    '#FFAA5C', // Muted orange
    '#5CDDA1', // Muted mint-green
    '#F07178', // Soft coral red
    '#C2B280', // Muted gold
    '#8693AB', // Dusty blue-grey
    '#F18F01', // Warm mustard
    '#A3B18A', // Desaturated moss green
  ];
  
  

const getColor = (index: number) => colors[index % colors.length];

type MuscleSetData = {
  muscle: string;
  sets: number;
};

type MuscleGroupPieChartProps = {
  data: MuscleSetData[];
};

const MuscleGroupPieChart: React.FC<MuscleGroupPieChartProps> = ({ data }) => {
  const pieChartInfo = data.map((item, index) => ({
    name: item.muscle,
    sets: item.sets,
    color: getColor(index),
    legendFontColor: '#fff',
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <PieChart
        data={pieChartInfo}
        width={screenWidth * 0.85}
        height={220}
        chartConfig={chartConfig}
        accessor="sets"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend
      />
    </View>
  );
};

const chartConfig = {
  backgroundColor: '#1c1f23',
  backgroundGradientFrom: '#1c1f23',
  backgroundGradientTo: '#1c1f23',
  color: () => 'white',
  labelColor: () => 'white',
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 12,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default MuscleGroupPieChart;