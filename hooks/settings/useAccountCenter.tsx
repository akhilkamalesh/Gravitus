import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/authContext";
import { changeUserEmail, changeUserName, changeUserPassword, deleteAccount } from "@/lib/firestoreFunctions";
import { confirmAction } from "@/lib/orchestration/accountService";


export type AccountCenterHandlers = ReturnType<typeof useAccountCenter>;

// Account Modal Title
export type AccountModalTitle = "Change Name" | "Change Email" | "Change Password" | "";

export function useAccountCenter() {
    const router = useRouter();
    const { signOut } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState<AccountModalTitle>("");

    /**
     * open modal
     */
    const openModal = useCallback((title: AccountModalTitle) => {
        setModalTitle(title);
        setModalVisible(true);
    }, []);

    /**
     * closing modal
     */
    const closeModal = useCallback(() => setModalVisible(false), []);

    /**
     * handling changing name, email, password
     */
    const handleModalSubmit = useCallback(
        async (inputs: { name?: string; email?: string; password?: string }) => {
        try {
            if (inputs.name) await changeUserName(inputs.name);
            if (inputs.email) await changeUserEmail(inputs.email);
            if (inputs.password) await changeUserPassword(inputs.password);
            closeModal();
        } catch (e) {
            console.error("AccountCenter: update failed", e);
        }},
        [closeModal]
    );

    /**
     * handling delete function - using confirm action
     */
    const handleDelete = useCallback(() => {
        confirmAction("Delete Account", "Are you sure you want to delete?", async () => {
        try {
            await deleteAccount();
            // Optional: toast/Alert here
            router.replace("../(auth)/auth");
        } catch (e) {
            console.error("AccountCenter: delete failed", e);
        }});
    }, [router]);

    /**
     * handling sign out
     */
    const handleSignOut = useCallback(async () => {
        try {
            await signOut();
            router.replace("/(auth)/auth");
        } catch (e) {
            console.error("AccountCenter: signOut failed", e);
        }   
    }, [router, signOut]);


    return {
        modalVisible,
        modalTitle,
        openModal,
        closeModal,
        handleModalSubmit,
        handleDelete,
        handleSignOut,
    } as const;
}