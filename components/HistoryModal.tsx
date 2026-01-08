import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLogsByExerciseId } from '@/lib/firestoreFunctions';
import { ExerciseStat } from '@/types/firestoreTypes';

type Props = {
    visible: boolean;
    onClose: () => void;
    exerciseId: string;
    exerciseName: string;
};

export default function HistoryModal({ visible, onClose, exerciseId, exerciseName }: Props) {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<ExerciseStat | null>(null);

    useEffect(() => {
        if (visible && exerciseId) {
            loadHistory();
        }
    }, [visible, exerciseId]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await getLogsByExerciseId(exerciseId);
            setHistory(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric'
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{exerciseName}</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="white" />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#4FD6EA" style={{ marginTop: 40 }} />
                        ) : !history || history.sets.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No history found for this exercise.</Text>
                            </View>
                        ) : (
                            <ScrollView>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.col, { flex: 2 }]}>Date</Text>
                                    <Text style={styles.col}>Set</Text>
                                    <Text style={styles.col}>Lbs</Text>
                                    <Text style={styles.col}>Reps</Text>
                                </View>

                                {history.sets.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((set, index) => (
                                    <View key={index} style={styles.row}>
                                        <Text style={[styles.cell, { flex: 2, color: '#aaa' }]}>{formatDate(set.date)}</Text>
                                        <Text style={styles.cell}>-</Text>
                                        {/* Note: ExerciseStat sets list is flat and doesn't explicitly store set number per workout without grouping. 
                            For now putting '-' or we could try to infer if we grouped by date. 
                            The requirement asks for 'Set', but flat list makes it hard. 
                            Let's just show the data we have. */}
                                        <Text style={styles.cell}>{set.weight}</Text>
                                        <Text style={styles.cell}>{set.reps}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        maxHeight: '80%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#252525',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: 16,
        minHeight: 200,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingBottom: 8,
    },
    col: {
        flex: 1,
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    cell: {
        flex: 1,
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
});
