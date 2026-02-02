import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DateData } from 'react-native-calendars';

import { CalendarView } from '@/components/Calendar/CalendarView';
import { getLoggedWorkouts, getCurrentSplit } from '@/lib/firestoreFunctions';
import { ExerciseLog, Split } from '@/types/firestoreTypes';
import { getCalendarMarkings, CalendarMarking } from '@/lib/calendarUtils';

export default function CalendarScreen() {
    const [logs, setLogs] = useState<ExerciseLog[]>([]);
    const [currentSplit, setCurrentSplit] = useState<Split | null>(null);
    const [markings, setMarkings] = useState<Record<string, CalendarMarking>>({});
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            // Fetch in parallel
            const [fetchedLogs, fetchedSplit] = await Promise.all([
                getLoggedWorkouts(),
                getCurrentSplit()
            ]);

            setLogs(fetchedLogs);
            setCurrentSplit(fetchedSplit);

            const newMarkings = getCalendarMarkings(fetchedLogs, fetchedSplit);
            setMarkings(newMarkings);

        } catch (error) {
            console.error("Error fetching calendar data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
    };

    const selectedDayData = markings[selectedDate];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Training Calendar</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}
            >
                <CalendarView
                    markings={markings}
                    onDayPress={handleDayPress}
                    selectedDate={selectedDate}
                />

                <View style={styles.detailsContainer}>
                    <Text style={styles.dateHeader}>
                        {(() => {
                            const [year, month, day] = selectedDate.split('-').map(Number);
                            // Create date in local time (months are 0-indexed)
                            const localDate = new Date(year, month - 1, day);
                            return localDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                        })()}
                    </Text>

                    {loading ? (
                        <ActivityIndicator color="#00D09C" />
                    ) : selectedDayData ? (
                        <View style={styles.workoutCard}>
                            <View style={[styles.statusIndicator, { backgroundColor: selectedDayData.dotColor }]} />
                            <View style={styles.cardContent}>
                                <Text style={styles.workoutTitle}>{selectedDayData.workoutName}</Text>
                                <Text style={styles.workoutSubtitle}>
                                    {selectedDayData.isFuture ? "Scheduled" : "Completed"}
                                </Text>
                            </View>
                            {selectedDayData.isFuture ? (
                                <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
                            ) : (
                                <Ionicons name="checkmark-circle" size={24} color="#00D09C" />
                            )}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No workout logged or scheduled.</Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 2,
    },
    toggleBtn: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 18,
    },
    toggleBtnActive: {
        backgroundColor: '#333',
    },
    toggleText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 12,
    },
    toggleTextActive: {
        color: '#FFF',
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingBottom: 40,
    },
    detailsContainer: {
        marginTop: 10,
    },
    dateHeader: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
    },
    workoutCard: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    statusIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    workoutTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    workoutSubtitle: {
        color: '#999',
        fontSize: 14,
    },
    emptyState: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#222',
        borderStyle: 'dashed'
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
    }
});
