// app/(tabs)/TabOneScreen.tsx
import { ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/lib/authContext';
import GravitusHeader from '@/components/GravitusHeader';
import SectionHeader from '@/components/SectionHeader';
import TodayPlanCard from '@/components/home/TodayPlanCard';
import ExploreCard from '@/components/home/ExploreCard';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useHomeSummary } from '@/hooks/home/useHomeSummary';


export default function TabOneScreen() {
  const router = useRouter();
  const { user, userData } = useAuth(); // calling auth context
  const { isDone, workoutMeta } = useHomeSummary(); // calling hook context

  if (user === null) return <Redirect href="../(auth)/auth" />; // shoots to auth screen is user is null

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121417' }}>
      <GravitusHeader />
      <Text style={{ fontSize: 28, fontWeight: '600', color: '#fff', textAlign: 'center', marginVertical: 12 }}>
        Welcome Back, {userData?.name}
      </Text>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 48 }}>
        <SectionHeader title="Today's Plan" />
        <TodayPlanCard // New card that takes in isDone, workoutMeta (pulled from hook)
          isDone={isDone}
          workoutMeta={workoutMeta}
          onPress={() => router.push('/two')}
        />

        <SectionHeader title="Explore" />
        <ExploreCard
          title="History"
          height={110}
          onPress={() => router.push('/(history)/history')}
          icon={<Feather name="clock" size={28} color="white" />}
        />
        <ExploreCard
          title="Training Splits"
          height={110}
          onPress={() => router.push('/(trainingSplits)/trainingSplits')}
          icon={<Feather name="grid" size={28} color="white" />}
        />
        <ExploreCard
          title="Exercises"
          height={110}
          onPress={() => router.push('/(exercises)/exercises')}
          icon={<MaterialCommunityIcons name="weight-lifter" size={28} color="white" />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
