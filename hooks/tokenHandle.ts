import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from "react-native"


// Save token
export async function saveToken(token: string) {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem('auth', token);
        } else { // mobile
            await SecureStore.setItemAsync('auth', token);
        }
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

// Retrieve token
export async function getToken(): Promise<string | null> {
    try {
        if (Platform.OS === 'web') {
            const token = await AsyncStorage.getItem('auth');
            return token; // The token or null
        } else {
            const token = await SecureStore.getItemAsync('auth');
            return token; // The token or null
        }
    } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
    }
}

// Delete token
export async function deleteToken() {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem('auth');
        } else {
            await SecureStore.deleteItemAsync('auth');
        }
        console.log('Token deleted successfully');
    } catch (error) {
        console.error("Error deleting token:", error);
    }
}
