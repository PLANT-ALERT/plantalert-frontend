import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from "@/constants/Colors";
import {getData} from "@/hooks/setStorageData";

type ThemeType = 'light' | 'dark';

export type themesTypes = typeof Colors['light'] | typeof Colors['dark'];

interface ThemeContextProps {
    theme: typeof Colors['light'] | typeof Colors['dark'];
    themeMode: ThemeType;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [themeMode, setThemeMode] = useState<ThemeType>('light');

    // Load theme from storage on mount
    useEffect(() => {
        const loadTheme = async () => {
            const storedTheme = await getData({storeKey: "theme"});
            if (storedTheme === 'light' || storedTheme === 'dark') {
                setThemeMode(storedTheme as ThemeType);
            }
        };
        loadTheme();
    }, []);

    // Toggle theme and save it to AsyncStorage
    const toggleTheme = async () => {
        const newTheme = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newTheme);
        await AsyncStorage.setItem('themeMode', newTheme);
    };

    const theme = themeMode === 'light' ? Colors.light : Colors.dark;

    return (
        <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
