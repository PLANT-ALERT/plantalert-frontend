import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useTheme } from "@/components/ThemeProvider"; // Replace with your actual theme hook

const GradiatedProgressBar = ({ progress = 0, min = 0, max = 100 }) => {
    const { theme } = useTheme();

    const progressAnim = useRef(new Animated.Value(0)).current;

    const effectiveMin = Math.min(min, max);
    const effectiveMax = Math.max(min, max);

    // Clamp progress within min-max
    const clampedProgress = Math.max(effectiveMin, Math.min(progress, effectiveMax));

    // Normalize progress within the given range
    const normalizedProgress = ((clampedProgress - effectiveMin) / (effectiveMax - effectiveMin)) * 100;



    // Animate progress
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: normalizedProgress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    // Determine color based on zone
    const getProgressColor = () => {
        if (progress <= min) return "red";
        if (progress > min && progress < max) return "green";
        return "red";
    };

    const interpolatedWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={[styles.container, { borderColor: theme.border }]}>
            <View style={[styles.barBackground, { backgroundColor: theme.background }]}>
                <Animated.View
                    style={[
                        styles.barForeground,
                        {
                            width: interpolatedWidth,
                            backgroundColor: getProgressColor(),
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 20,
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        overflow: "hidden",
    },
    barBackground: {
        flex: 1,
        borderRadius: 10,
    },
    barForeground: {
        height: "100%",
        borderRadius: 10,
    },
});

export default GradiatedProgressBar;