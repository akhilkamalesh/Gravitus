import React, {useEffect, useState} from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import FloatingCard from '@/components/floatingbox';
import GravitusHeader from '@/components/title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/authContext';
import SignUpModal from '../(auth)/signUp';



export default function TabOneScreen() {

  const router = useRouter(); 
  const {user, userData, signOut} = useAuth();

  console.log(userData)

  const handleSignOut = async () => {
    try {
      // await signOut()
      router.replace('/(auth)/auth')
    } catch (e: any) {
      console.error(e);
    }
  };

  // UseEffect -> grab today's workout and display it in the today's workout tab

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader />
      <Text style={styles.welcome}>Welcome Back, {userData?.name}</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FloatingCard height={155} width="90%">
          <Text style={styles.text}>Weekly Progress</Text>
        </FloatingCard>
        <FloatingCard height={155} width="90%" onPress={() => router.push('/two')}>
          <Text style={styles.text}>Today's Workout</Text>
        </FloatingCard> 
        <View style={styles.row}>
          <FloatingCard height={125} width={167} onPress={() => router.push('/(history)/history')}>
            <Text style={styles.text}>History</Text>
          </FloatingCard>
          <FloatingCard height={125} width={167}>
            <Text style={styles.text}>Goals and PRs</Text>
          </FloatingCard>
        </View>
        <FloatingCard height={125} width="90%" onPress={()=>router.push('/(trainingSplits)/trainingSplits')}>
          <Text style={styles.text}>Training Splits</Text>
        </FloatingCard>
        <FloatingCard height={125} width="90%" onPress={()=>router.push('/(exercises)/exercises')}>
          <Text style={styles.text}>Exercises</Text>
        </FloatingCard>
        <TouchableOpacity onPress={handleSignOut}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1c1f23',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  welcome: {
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    flexWrap: 'wrap',
    margin: 12
  },
  text: {
    color: 'white',
    fontWeight: '600',
  }
});
