import React, { useEffect, useState } from 'react';
import FloatingCard from '@/components/floatingbox';
import GravitusHeader from '@/components/title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentSplit, addSplitToTemplates } from '@/lib/firestoreFunctions';
import { Split } from '@/types/firestoreTypes';
import { Feather } from '@expo/vector-icons';
import { arnold } from '@/jsonData/splitData';

export default function TrainingSplits() {
  const router = useRouter();
  const [currentSplit, setCurrentSplit] = useState<Split | null>(null);

  const splits = [
    { id: 'pushPullLegs', name: 'Push / Pull / Legs' },
    { id: 'upperLower', name: 'Upper / Lower' },
    { id: 'arnold', name: 'Arnold'}
  ];

  const addSplit = async () => {
    await addSplitToTemplates(arnold);
  } 

  useEffect(() => {
    const fetchSplit = async () => {
      try {
        const split = await getCurrentSplit();
        setCurrentSplit(split);
      } catch (err) {
        console.error("Failed to fetch current split:", err);
      }
    };
    fetchSplit();
  }, []);

  console.log(currentSplit)

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader showBackButton={true} />
      <Text style={styles.mainTitle}>Training Splits</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.subtitle}>Current Split</Text>
        <FloatingCard width="90%" height={70} onPress={() => router.push(`/(trainingSplits)/${currentSplit?.id}`)}>
          <View style={styles.cardContent}>
            <Feather name="calendar" size={18} color="#bbb" style={styles.cardIcon} />
            <Text style={styles.text}>{currentSplit?.name}</Text>
          </View>
        </FloatingCard>

        <Text style={styles.subtitle}>Create Your Own!</Text>
        <FloatingCard width="90%" height={70} onPress={() => router.push('/(trainingSplits)/create')}>
          <View style={styles.cardContent}>
            <Feather name="edit" size={18} color="#bbb" style={styles.cardIcon} />
            <Text style={styles.text}>Create Your Own</Text>
          </View>
        </FloatingCard>

        <Text style={styles.subtitle}>Explore Template Splits</Text>
        {splits.map((split) => (
          <FloatingCard key={split.id} height={70} width="90%" onPress={() => router.push(`/(trainingSplits)/${split.id}`)}>
            <View style={styles.cardContent}>
              <Feather name="folder" size={18} color="#bbb" style={styles.cardIcon} />
              <Text style={styles.text}>{split.name}</Text>
            </View>
          </FloatingCard>
        ))}

        {/* <Button title={'dededed'} onPress={()=>{addSplit()}}></Button> */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121417',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 12,
  },
  subtitle: {
    color: '#999',
    fontWeight: '600',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: '5%',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  cardIcon: {
    marginTop: 2,
  },
});
