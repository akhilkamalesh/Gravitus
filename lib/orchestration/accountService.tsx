import { Alert } from "react-native";

/**
 * Confirming actions changeUsername, deleteAccount, signOut used in accountCenter
 * @param title - title
 * @param message - message
 * @param onConfirm - function
 * @param confirmText - Confirm
 * @param cancelText - Cancel
 */
export function confirmAction(
    title: string,
    message: string,
    onConfirm: () => void,
        confirmText: string = "Confirm",
        cancelText: string = "Cancel"
    ) {
    Alert.alert(title, message, [
        { text: cancelText, style: "cancel" },
        { text: confirmText, style: "destructive", onPress: onConfirm },
    ]);
}