
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface SplitScheduleFormProps {
    selectedDays: string[];
    onChange: (days: string[]) => void;
    daysPerCycle: string;
    onChangeDaysPerCycle: (val: string) => void;
}

export default function SplitScheduleForm({ selectedDays, onChange, daysPerCycle, onChangeDaysPerCycle }: SplitScheduleFormProps) {
    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            onChange(selectedDays.filter(d => d !== day));
        } else {
            onChange([...selectedDays, day]);
        }
    };

    const count = Number(daysPerCycle) || 0;
    const increment = () => onChangeDaysPerCycle(String(Math.min(count + 1, 7)));
    const decrement = () => onChangeDaysPerCycle(String(Math.max(count - 1, 1)));

    return (
        <View style={styles.container}>
            <Text style={styles.sectionLabel}>DAYS PER WEEK</Text>
            <View style={styles.counterRow}>
                <TouchableOpacity onPress={decrement} style={styles.counterBtn}>
                    <Ionicons name="remove" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{count}</Text>
                <TouchableOpacity onPress={increment} style={styles.counterBtn}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {count > 0 && (
                <>
                    <Text style={[styles.sectionLabel, { marginTop: 30 }]}>SELECT TRAINING DAYS (OPTIONAL)</Text>
                    <Text style={styles.subtitle}>Which specific days do you plan to train?</Text>

                    <View style={styles.daysContainer}>
                        {DAYS.map(day => {
                            const isSelected = selectedDays.includes(day);
                            return (
                                <TouchableOpacity
                                    key={day}
                                    activeOpacity={0.7}
                                    style={[styles.dayButton, isSelected && styles.selectedDay]}
                                    onPress={() => toggleDay(day)}
                                >
                                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        width: '100%',
    },
    sectionLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 10,
        fontWeight: '600',
        alignSelf: 'flex-start',
    },
    subtitle: {
        color: '#666',
        fontSize: 14,
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 20,
    },
    counterBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        minWidth: 30,
        textAlign: 'center',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'flex-start', // Left align grid
    },
    dayButton: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    selectedDay: {
        backgroundColor: '#4FD6EA',
        borderColor: '#4FD6EA',
    },
    dayText: {
        color: '#888',
        fontWeight: '600',
        fontSize: 12,
    },
    selectedDayText: {
        color: '#000',
    }
});

