import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import FloatingCard from "@/components/floatingbox";
import GravitusHeader from "@/components/GravitusHeader";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsPage(){

    const router = useRouter();

    return(
        <SafeAreaView style={styles.screen}>
            <GravitusHeader/>
            <Text style={styles.welcome}>Settings</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <FloatingCard width="90%" onPress={() => {router.push('../(settings)/privacyPolicy')}}>
                    <View style={styles.cardContent}>
                        <Feather name="book" size={18} color="#bbb" style={styles.cardIcon} />
                        <Text style={styles.text}>Privacy Policy</Text>
                    </View>
                </FloatingCard>
                <FloatingCard width="90%" onPress={() => {router.push('../(settings)/accountCenter')}}>
                    <View style={styles.cardContent}>
                        <Feather name="user-check" size={18} color="#bbb" style={styles.cardIcon} />
                        <Text style={styles.text}>Account Center</Text>
                    </View>
                </FloatingCard>
            </ScrollView>
        </SafeAreaView>
    )
}


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
})


