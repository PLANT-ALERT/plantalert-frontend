import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {useTheme} from "@/components/ThemeProvider";

export default function TabLayout() {
    let {theme} = useTheme();

    return (
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: theme.tabIconSelected,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    sceneStyle: Platform.select({
                        default: {
                            backgroundColor: theme.background,
                        },
                    }),
                    tabBarStyle: Platform.select({
                        ios: {
                            // Use a transparent background on iOS to show the blur effect
                            position: 'absolute',
                        },
                        default: {
                            backgroundColor: theme.tabs,
                        },
                    }),
                    headerStyle: Platform.select({
                        default: {
                            backgroundColor: theme.background,
                        }
                    })
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Sensors',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" />,
                    }}
                />
                <Tabs.Screen
                    name="add_senzor"
                    options={{
                        title: 'Add Senzor',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus"  />,
                    }}
                />
            </Tabs>


  );
}
