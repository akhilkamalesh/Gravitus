import React from 'react';
import { Text, StyleSheet } from 'react-native';

const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
);

const styles = StyleSheet.create({
    sectionHeader: {
        alignSelf: 'flex-start',
        color: '#999',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 8,
        paddingHorizontal: '5%',
    },
});


export default SectionHeader;