import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/authContext';
import GravitusHeader from '@/components/title';
import FloatingCard from '@/components/floatingbox';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabOneScreen() {
  const router = useRouter();
  const { userData } = useAuth();

  const handleSignOut = async () => {
    try {
      // await signOut()
      router.replace('/(auth)/auth');
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader />
      <Text style={styles.welcome}>Welcome Back, {userData?.name}</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <SectionHeader title="Your Stats" />
        <FloatingCard height={155} width="90%">
          <Text style={styles.cardTitle}>Weekly Progress</Text>
          <Feather name="bar-chart" size={40} color="white" style={styles.cardIcon} />
        </FloatingCard>

        <FloatingCard height={155} width="90%" onPress={() => router.push('/two')}>
          <Text style={styles.cardTitle}>Today's Workout</Text>
          <MaterialCommunityIcons name="dumbbell" size={40} color="white" style={styles.cardIcon} />
        </FloatingCard>

        <SectionHeader title="Explore" />
        <View style={styles.row}>
          <FloatingCard height={130} width={167} onPress={() => router.push('/(history)/history')}>
            <Text style={styles.cardTitleSmall}>History</Text>
            <Feather name="clock" size={28} color="white" />
          </FloatingCard>
          <FloatingCard height={130} width={167}>
            <Text style={styles.cardTitleSmall}>Goals & PRs</Text>
            <Feather name="target" size={28} color="white" />
          </FloatingCard>
        </View>

        <FloatingCard height={130} width="90%" onPress={() => router.push('/(trainingSplits)/trainingSplits')}>
          <Text style={styles.cardTitleSmall}>Training Splits</Text>
          <Feather name="grid" size={28} color="white" />
        </FloatingCard>

        <FloatingCard height={130} width="90%" onPress={() => router.push('/(exercises)/exercises')}>
          <Text style={styles.cardTitleSmall}>Exercises</Text>
          <MaterialCommunityIcons name="weight-lifter" size={28} color="white" />
        </FloatingCard>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121417',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 12,
  },
  sectionHeader: {
    alignSelf: 'flex-start',
    color: '#999',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: '5%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    gap: 12,
  },
  cardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardTitleSmall: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardIcon: {
    marginTop: 4,
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: '#26292e',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  signOutText: {
    color: '#eee',
    fontWeight: '600',
    fontSize: 16,
  },
});
