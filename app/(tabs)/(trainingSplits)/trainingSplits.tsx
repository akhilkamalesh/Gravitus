import React, { useCallback, useEffect, useState } from 'react';
import FloatingCard from '@/components/floatingbox';
import GravitusHeader from '@/components/title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, Text, View, Button } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getCurrentSplit, addSplitToTemplates, getSplits } from '@/lib/firestoreFunctions';
import { Split } from '@/types/firestoreTypes';
import { Feather } from '@expo/vector-icons';
import { arnold, pushPullLegs } from '@/jsonData/splitData';
import { push } from 'expo-router/build/global-state/routing';

export default function TrainingSplits() {
  const router = useRouter();
  const [currentSplit, setCurrentSplit] = useState<Split | null>(null);
  const [splits, setSplits] = useState<Split[]>();

  // Admin Function - need to remove
  const addSplit = async () => {
    await addSplitToTemplates(pushPullLegs);
  } 


  useFocusEffect(
    useCallback(() => {
      const fetchSplit = async () => {
        try {
          const split = await getCurrentSplit();
          setCurrentSplit(split);
        } catch (err) {
          console.error("Failed to fetch current split:", err);
        }
      };
  
      const fetchSplits = async () => {
        try{
          const splits = await getSplits();
          if(splits){
            setSplits(splits)
          }
        }catch (err){
          console.error(err)
        }
      }
      fetchSplit();
      fetchSplits();
    }, []));

  console.log(currentSplit)
  console.log(splits)

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader showBackButton={true} />
      <Text style={styles.mainTitle}>Training Splits</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {currentSplit !== null && (
          <Text style={styles.subtitle}>Current Split</Text>
        )}
        {currentSplit !== null && (
            <FloatingCard width="90%" height={70} onPress={() => router.push(`/(trainingSplits)/${currentSplit?.id}`)}>
              <View style={styles.cardContent}>
                <Feather name="calendar" size={18} color="#bbb" style={styles.cardIcon} />
                <Text style={styles.text}>{currentSplit?.name}</Text>
              </View>
            </FloatingCard>
        )}


        <Text style={styles.subtitle}>Create Your Own!</Text>
        <FloatingCard width="90%" height={70} onPress={() => router.push('/(trainingSplits)/create')}>
          <View style={styles.cardContent}>
            <Feather name="edit" size={18} color="#bbb" style={styles.cardIcon} />
            <Text style={styles.text}>Create Your Own</Text>
          </View>
        </FloatingCard>

        <Text style={styles.subtitle}>Explore Template Splits</Text>
        {splits?.map((split) => (
          <FloatingCard key={split.id} height={70} width="90%" onPress={() => router.push(`/(trainingSplits)/${split.id}`)}>
            <View style={styles.cardContent}>
              <Feather name="folder" size={18} color="#bbb" style={styles.cardIcon} />
              <Text style={styles.text}>{split.name}</Text>
            </View>
          </FloatingCard>
        ))}

        {// Admin button - needs to be removed
        /* <Button title={'dededed'} onPress={()=>{addSplit()}}></Button> */}

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
