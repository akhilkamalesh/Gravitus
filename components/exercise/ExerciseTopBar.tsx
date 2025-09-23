// components/exercises/ExercisesTopBar.tsx
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBar from '@/components/SearchBar';

/**
 * A top bar component for the exercises screen, featuring a search bar and a filter icon.
 *
 * @param search - The current search query string.
 * @param setSearch - Callback to update the search query.
 * @param onOpenFilter - Callback invoked when the filter icon is pressed.
 *
 * @returns A React element displaying the search bar and filter icon.
 */
export default function ExercisesTopBar({
  search, setSearch, onOpenFilter,
}: { search: string; setSearch: (v: string) => void; onOpenFilter: () => void; }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginHorizontal:15, marginBottom:12, gap:8 }}>
      <SearchBar value={search} onChange={setSearch} />
      <Feather name="filter" size={22} color="#bbb" style={{ padding:6 }} onPress={onOpenFilter} />
    </View>
  );
}
