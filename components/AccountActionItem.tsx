import React from "react";
import { View, Text, StyleSheet, GestureResponderEvent } from "react-native";
import FloatingCard from "@/components/floatingbox";


interface Props {
    label: string;
    onPress: (e: GestureResponderEvent) => void;
}


export default function AccountActionItem({ label, onPress }: Props) {
    return (
        <FloatingCard width="90%" onPress={onPress}>
            <View style={styles.cardContent}>
                <Text style={styles.text}>{label}</Text>
            </View>
        </FloatingCard>
    );
}


const styles = StyleSheet.create({
    cardContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        gap: 12,
    },
    text: {
        color: "white",
        fontWeight: "600",
        fontSize: 18,
    },
});