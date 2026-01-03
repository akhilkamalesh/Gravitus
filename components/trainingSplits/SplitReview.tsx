import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { workout, Exercise } from '@/types/firestoreTypes';

interface SplitReviewProps {
    name: string;
    description: string;
    trainingStyle: string;
    weeksDuration: number;
    workouts: workout[];
    exercises: Exercise[]; // to resolve names
}

export default function SplitReview({
    name, description, trainingStyle, weeksDuration, workouts, exercises
}: SplitReviewProps) {

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{name || 'Untitled'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{description || 'No description'}</Text>
            </View>

            <View style={styles.row}>
                <View style={[styles.section, { flex: 1 }]}>
                    <Text style={styles.label}>Style</Text>
                    <Text style={styles.value}>{trainingStyle || 'None'}</Text>
                </View>
                <View style={[styles.section, { flex: 1 }]}>
                    <Text style={styles.label}>Duration</Text>
                    <Text style={styles.value}>{weeksDuration} weeks</Text>
                </View>
            </View>

            <Text style={styles.subHeader}>Workouts</Text>
            {workouts.length === 0 && <Text style={styles.placeholder}>No workouts added.</Text>}
            {workouts.map((w, i) => (
                <View key={i} style={styles.card}>
                    <Text style={styles.dayName}>{w.dayName || `Day ${i + 1}`}</Text>
                    {w.exercises.map((ex, j) => {
                        const exName = exercises.find(e => e.id === ex.exerciseId)?.name || 'Unknown Exercise';
                        return (
                            <Text key={j} style={styles.exerciseLine}>
                                • {exName}: {ex.sets} x {ex.reps.min}-{ex.reps.max} reps (RPE {ex.rpe || '-'})
                            </Text>
                        )
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20, // Increased horizontal padding
        paddingBottom: 80, // Space for bottom button
        width: '100%',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        marginTop: 10,
        textAlign: 'left', // Left align
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ddd',
        marginTop: 20,
        marginBottom: 10,
    },
    section: {
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        gap: 20, // Increased gap
    },
    label: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    value: {
        color: '#fff',
        fontSize: 16,
    },
    card: {
        backgroundColor: '#222',
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
    },
    dayName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    exerciseLine: {
        color: '#bbb',
        fontSize: 14,
        marginLeft: 10,
        marginBottom: 4,
    },
    placeholder: {
        color: '#666',
        fontStyle: 'italic',
    }
});
