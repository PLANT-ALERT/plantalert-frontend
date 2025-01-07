import React, { PropsWithChildren, useState, useEffect, useRef } from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getColors } from '@/constants/Colors';
import {getColorReverseIcon} from "@/utils/theme";
import {SFSymbols5_0} from "sf-symbols-typescript";

let colors = getColors();

export function Collapsible({children, iconName, text}:{children: React.ReactNode, iconName: SFSymbols5_0, text: string} ) {
  const [isOpen, setIsOpen] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggleDrawer = () => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0, // 1 for 180 degrees, 0 for 0 degrees
        duration: 300, // Duration in ms
        useNativeDriver: true, // Smooth animations
      }),
      Animated.timing(heightAnim, {
        toValue: isOpen ? 0 : 150, // Adjust the height based on the content (e.g., 150)
        duration: 300, // Duration of animation in ms
        useNativeDriver: false, // Height animations require `useNativeDriver: false`
      }),
    ]).start();
    setIsOpen(!isOpen);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1], // 0 is 0 degrees, 1 is 180 degrees
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={toggleDrawer}
        >

        <IconSymbol
            name={iconName}
            size={18}
            weight="medium"
            color={getColorReverseIcon()}
        />

        <Text style={styles.rowLabel}>{text}</Text>

        <View style={styles.rowSpacer}></View>

        <Animated.View style={{
          transform: [{ rotate: rotation }], // Apply rotation animation
        }}>

          <IconSymbol
              name="chevron.up"
              size={18}
              weight="medium"
              color={getColorReverseIcon()}
          />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.drawer, { height: heightAnim }]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    gap: 10,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  drawer: {
    width: "100%",
    overflow: "hidden", // Ensure content is clipped when collapsed
    borderRadius: 8,
    backgroundColor: colors.background,
    display: "flex",
    flexDirection: "column",
    gap: 5,
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.text,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
