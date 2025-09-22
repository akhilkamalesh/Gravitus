// components/history/HistoryTopBar.tsx
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBar from '@/components/SearchBar';

/**
 * Search bar and filter button at the top of the history page
 * @param param0 dictionary containing:
 *  @param searchText The current text in the search bar
 *  @param setSearchText Function to update the search text
 *  @param onOpenFilter Function to open the filter modal
 * @returns 
 */
export default function HistoryTopBar({
  searchText, setSearchText, onOpenFilter,
}: {
  searchText: string;
  setSearchText: (v: string) => void;
  onOpenFilter: () => void;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 15, marginBottom: 12, gap: 8 }}>
      <SearchBar value={searchText} onChange={setSearchText} placeholder="Search By Workout..." />
      <Feather name="filter" size={22} color="#bbb" style={{ padding: 6 }} onPress={onOpenFilter} />
    </View>
  );
}
