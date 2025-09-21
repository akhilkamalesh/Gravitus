import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import GravitusHeader from "@/components/GravitusHeader";
import AccountActionItem from "@/components/AccountActionItem";
import AccountCenterModal from "@/components/AccountCenterModal";
import { useAccountCenter } from "@/hooks/settings/useAccountCenter";


export default function AccountCenterScreen() {
    const {
        modalVisible,
        modalTitle,
        openModal,
        closeModal,
        handleModalSubmit,
        handleDelete,
        handleSignOut,
    } = useAccountCenter();


    return (
        <SafeAreaView style={styles.screen}>
            <GravitusHeader showBackButton />
            <Text style={styles.title}>Account Center</Text>


            <ScrollView contentContainerStyle={styles.scrollContent}>
                <AccountActionItem label="Change User Name" onPress={() => openModal("Change Name")} />
                <AccountActionItem label="Change User Email" onPress={() => openModal("Change Email")} />
                <AccountActionItem label="Change Password" onPress={() => openModal("Change Password")} />
                <AccountActionItem label="Delete Account" onPress={handleDelete} />


                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>


            <AccountCenterModal
                visible={modalVisible}
                title={modalTitle}
                onClose={closeModal}
                handleFunction={handleModalSubmit}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#121417" },
    scrollContent: { alignItems: "center", paddingBottom: 48 },
    title: {
        fontSize: 28,
        fontWeight: "600",
        color: "#ffffff",
        textAlign: "center",
        marginVertical: 12,
    },
    signOutButton: {
        marginTop: 20,
        backgroundColor: "#26292e",
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#444",
    },
    signOutText: { color: "#eee", fontWeight: "600", fontSize: 16 },
});