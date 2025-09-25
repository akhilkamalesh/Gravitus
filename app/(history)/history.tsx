// app/(history)/history.tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import GravitusHeader from '@/components/GravitusHeader';
import HistoryTopBar from '@/components/history/HistoryTopBar';
import HistoryItem from '@/components/history/HistoryItem';
import MuscleGroupModal from '@/components/MuscleGroupModal';
import { useHistory } from '@/hooks/history/useHistory';

/**
 * Main screen for viewing logged workouts
 *  pulls data using the useHistory hook
 * @returns The main screen for viewing logged workouts
 */
export default function HistoryScreen() {
  const router = useRouter();
  const {
    loading, filtered, splitNames, splitOptions,
    searchText, setSearchText, selectedSplits, toggleSplit, clearSplits,
  } = useHistory();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#121417' }}>
      <GravitusHeader showBackButton />
      <Text style={{ fontSize:28, fontWeight:'600', color:'white', alignSelf:'center', marginVertical:12 }}>
        Logged Workouts
      </Text>

      {// Top bar with search and filter button
      }
      <HistoryTopBar
        searchText={searchText}
        setSearchText={setSearchText}
        onOpenFilter={() => setModalVisible(true)}
      />

      {// List of logged workouts depending on filter results
      }
      <ScrollView contentContainerStyle={{ alignItems:'center', paddingBottom:36 }}>
        {!loading && filtered.map(w => (
          <HistoryItem
            key={w.id}
            logId={w.id}
            date={w.date}
            dayName={w.workoutDay}
            splitName={splitNames[w.splitId] ?? 'One-Off'}
            onPress={(id) => router.push(`/(history)/${id}`)}
          />
        ))}
      </ScrollView>

      {// Modal for selecting muscle groups to filter by
      }
      <MuscleGroupModal
        visible={modalVisible}
        selected={selectedSplits}
        options={splitOptions}
        onSelect={toggleSplit}
        onClear={clearSplits}
        onApply={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
        title="Select Split"
      />
    </SafeAreaView>
  );
}