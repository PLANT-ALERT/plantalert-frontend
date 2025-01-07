import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Ionicons from '@expo/vector-icons/Ionicons';
// icons
import Octicons from '@expo/vector-icons/Octicons';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { getColors } from '@/constants/Colors';
import {getTheme} from "@/utils/theme";

let colors = getColors();

export default function TabLayout() {
  const theme = getTheme();
    return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Senzors',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
        <Tabs.Screen
            name="add_senzor"
            options={{
                title: 'Add Senzor',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus" color={color} />,
            }}
        />
    </Tabs>
  );
}
