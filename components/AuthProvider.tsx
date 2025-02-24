import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from "@/hooks/setStorageData";

interface AuthContextProps {
    token: string | null;
    setToken: (newToken: string) => Promise<void>;
    removeToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setTokenState] = useState<string | null>(null);

    // Load token from storage on mount
    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await getData({ storeKey: "authToken" });
            if (storedToken) {
                setTokenState(storedToken);
            }
        };
        loadToken();
    }, []);

    // Set token and save it to AsyncStorage
    const setToken = async (newToken: string) => {
        setTokenState(newToken);
        await AsyncStorage.setItem('authToken', newToken);
    };

    // Remove token from storage
    const removeToken = async () => {
        setTokenState(null);
        await AsyncStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ token, setToken, removeToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};