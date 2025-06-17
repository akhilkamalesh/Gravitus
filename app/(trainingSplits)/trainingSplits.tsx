import React from 'react';
import FloatingCard from '@/components/floatingbox';
import GravitusHeader from '@/components/title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, Text, View} from 'react-native';
import BackButton from '@/components/backButton';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getCurrentSplit } from '@/lib/firestoreFunctions';
import { Split } from '@/types/firestoreTypes';



export default function TrainingSplits(){

    const router = useRouter(); 

    const [currentSplit, setCurrentSplit] = useState<Split | null>(null);

    const splits = [
        // {id: 'createYourOwn', name: 'Create Your Own!'},
        { id: 'pushPullLegs', name: 'Push / Pull / Legs' },
        { id: 'upperLower', name: 'Upper / Lower' },
        { id: 'gymBro', name: 'Gym Bro' },
        { id: 'antagonist', name: 'Antagonist' },
    ]

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

    return(
        <SafeAreaView style={styles.screen}>
            <GravitusHeader showBackButton={true}/>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.subtitle}>Current Split</Text>
                <FloatingCard width="90%" height={60} onPress={()=>router.push(`/(trainingSplits)/${currentSplit?.createdFromTemplateId}`)}>
                    <View style={styles.floatingView}>
                        <Text style={styles.text}>{currentSplit?.id}</Text>
                        <Text style={styles.text}>{currentSplit?.name}</Text>
                    </View>
                </FloatingCard>
                <Text style={styles.subtitle}>Explore Template Splits</Text>
                <FloatingCard width="90%" height={60} onPress={()=>router.push('/(trainingSplits)/create')}>
                    <View style={styles.floatingView}>
                        <Text style={styles.text}>Create Your Own</Text>
                    </View>
                </FloatingCard>
                {splits.map((split) => (
                    <FloatingCard key={split.id} height={60} width="90%" onPress={()=>router.push(`/(trainingSplits)/${split.id}`)}>
                        <View style={styles.floatingView}>
                            <Text style={styles.text}>{split.name}</Text>
                        </View>
                    </FloatingCard>
                ))}
            </ScrollView>
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#1c1f23',
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 14,
    },
    floatingView: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        fontWeight: '600',
        fontSize: 20,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    subText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    subTitleView: {
        marginTop: 20,
    },
    subtitle: {
        color: 'white',
        fontWeight: '600',
        fontSize: 20,
        marginTop: 20,
    }

})