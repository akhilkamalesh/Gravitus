import React, {useState} from "react";
import FloatingCard from "@/components/floatingbox";
import GravitusHeader from "@/components/title";
import { Text, SafeAreaView, ScrollView, StyleSheet, View, Alert } from "react-native";
import AccountCenterModal from "@/components/AccountCenterModal";
import { changeUserEmail, changeUserName, changeUserPassword, deleteAccount } from "@/lib/firestoreFunctions";
import { useRouter } from "expo-router";

export default function AccountCenter(){

    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState<"Change Name" | "Change Email" | "Change Password" | "">("");

    // Alert Pop-Up Confirmation
    const confirmAction = (title: string, message: string, onConfirm: () => void) => {
        Alert.alert(title, message, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Confirm', style: 'destructive', onPress: onConfirm },
        ]);
    };

    const handleModalSubmit = (inputs: { name?: string; email?: string; password?: string }) => {
        // Replace these with actual Firebase update functions
        if (inputs.name) changeUserName(inputs.name);
        if (inputs.email) changeUserEmail(inputs.email);
        if (inputs.password) changeUserPassword(inputs.password);
    };

    const handleDelete = async () => {
        confirmAction("Delete Account", "Are you sure you want to delete", async () => {
            try{
                await deleteAccount()
                console.log("Deleted Account")
                router.replace("../(auth)/auth")
            }catch (err){
                console.log("Error in deleting account")
            }
        });
    }

    const handleChange = (title: "Change Name" | "Change Email" | "Change Password" | "") => {
        setModalTitle(title);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.screen}>
            <GravitusHeader showBackButton={true}/>
            <Text style={styles.welcome}>Account Center</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <FloatingCard width="90%" onPress={() => {handleChange("Change Name")}}>
                    <View style={styles.cardContent}>
                        <Text style={styles.text}>Change User Name</Text>
                    </View>
                </FloatingCard>
                <FloatingCard width="90%" onPress={() => {handleChange("Change Email")}}>
                    <View style={styles.cardContent}>
                        <Text style={styles.text}>Change User Email</Text>
                    </View>
                </FloatingCard>
                <FloatingCard width="90%" onPress={() => {handleChange("Change Password")}}>
                    <View style={styles.cardContent}>
                        <Text style={styles.text}>Change Password</Text>
                    </View>
                </FloatingCard>
                <FloatingCard width="90%" onPress={() => handleDelete()}>
                    <View style={styles.cardContent}>
                        <Text style={styles.text}>Delete Account</Text>
                    </View>
                </FloatingCard>
            </ScrollView>
            <AccountCenterModal
                visible={modalVisible}
                title={modalTitle}
                onClose={() => setModalVisible(false)}
                handleFunction={handleModalSubmit}
            />
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
})
