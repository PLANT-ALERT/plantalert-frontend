import React, { useState, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SFSymbols5_0 } from "sf-symbols-typescript";
import {themesTypes, useTheme} from "@/components/ThemeProvider";


export function Collapsible({
  children,
  iconName,
  text,
}: {
  children: React.ReactNode;
  iconName: SFSymbols5_0;
  text: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const styles = returnStyles(theme)

  const toggleDrawer = () => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 0 : 1, // 1 for 180 degrees, 0 for 0 degrees
        duration: 300, // Duration in ms
        useNativeDriver: true, // Smooth animations
      }),
      Animated.timing(heightAnim, {
        toValue: isOpen ? 0 : 150, // Adjust the height based on the content (e.g., 150)
        duration: 300, // Duration of animation in ms
        useNativeDriver: false, // Height animations require `useNativeDriver: false`
      }),
    ]).start(() => {
      // Callback after animation completion
      if (isOpen) setIsOpen(false);
    });

    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1], // 0 is 0 degrees, 1 is 180 degrees
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View>
      <TouchableOpacity style={styles.heading} onPress={toggleDrawer}>
        <View style={styles.rowIcon}>
          <IconSymbol
              name={iconName}
              size={18}
              weight="medium"
          />
        </View>
        <Text style={styles.rowLabel}>{text}</Text>

        <View style={styles.rowSpacer}></View>
        <Animated.View
          style={{
            transform: [{ rotate: rotation }], // Apply rotation animation
          }}
        >
          <IconSymbol
            name="chevron.up"
            size={18}
            weight="medium"
          />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.drawer,
          { height: heightAnim, display: isOpen ? "flex" : "none" },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

function returnStyles(theme: themesTypes) {
  return StyleSheet.create({
    heading: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      height: 50,
      gap: 10,
      backgroundColor: theme.card,
      borderRadius: 8,
      paddingHorizontal: 12,
      borderWidth: 2,
      borderColor: theme.border,
    },
    drawer: {
      width: "100%",
      overflow: "hidden",
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.border,
      backgroundColor: theme.card,
      flexDirection: "column",
      gap: 5,
      marginTop: 10,
    },
    rowLabel: {
      fontSize: 17,
      fontWeight: "400",
      color: theme.text,
    },
    rowSpacer: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    rowIcon: {
      width: 32,
      height: 32,
      borderRadius: 9999,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

    },
  });

}

