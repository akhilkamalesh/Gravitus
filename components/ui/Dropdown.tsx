import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownProps {
    label?: string;
    data: string[];
    value: string;
    onSelect: (item: string) => void;
    placeholder?: string;
    style?: ViewStyle;
}

export default function Dropdown({ label, data, value, onSelect, placeholder = 'Select option', style }: DropdownProps) {
    const [visible, setVisible] = useState(false);

    const toggleDropdown = () => {
        setVisible(!visible);
    };

    const onItemPress = (item: string) => {
        onSelect(item);
        setVisible(false);
    };

    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
            <Text style={styles.itemText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
                <Text style={[styles.buttonText, !value && { color: '#888' }]}>
                    {value || placeholder}
                </Text>
                <Ionicons name={visible ? "chevron-up" : "chevron-down"} size={16} color="#ccc" />
            </TouchableOpacity>

            {visible && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false} // Small list, simple view
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 15,
        zIndex: 100, // Helps if we had overlapping, but blocking flow below is fine for now
    },
    label: {
        color: '#ccc',
        fontSize: 12,
        marginBottom: 4,
        marginLeft: 2,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222',
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#333',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
    dropdown: {
        backgroundColor: '#222',
        width: '100%',
        marginTop: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    itemText: {
        color: '#fff',
        fontSize: 14,
    },
});
