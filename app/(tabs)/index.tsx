// app/(tabs)/TabOneScreen.tsx
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/lib/authContext';
import GravitusHeader from '@/components/GravitusHeader';
import SectionHeader from '@/components/SectionHeader';
import TodayPlanCard from '@/components/home/TodayPlanCard';
import ExploreCard from '@/components/home/ExploreCard';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useHomeSummary } from '@/hooks/home/useHomeSummary';


import { LinearGradient } from 'expo-linear-gradient';

export default function TabOneScreen() {
  const router = useRouter();
  const { user, userData } = useAuth(); // calling auth context
  const { isDone, workoutMeta } = useHomeSummary(); // calling hook context

  if (user === null) return <Redirect href="../(onboarding)/welcomeScreen" />; // shoots to auth screen is user is null

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <LinearGradient
        colors={['rgba(79, 214, 234, 0.15)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 300,
          height: 300,
          borderBottomLeftRadius: 300,
        }}
        pointerEvents="none"
      />
      <GravitusHeader />
      <View style={{ paddingHorizontal: '5%' }}>
        <Text style={{ fontSize: 32, fontWeight: '700', color: '#fff', marginTop: 12 }}>
          Hello, {userData?.name?.split(' ')[0] ?? 'Athlete'}
        </Text>
        <Text style={{ fontSize: 16, color: '#666', marginTop: 4 }}>
          Ready to train?
        </Text>
      </View>

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
