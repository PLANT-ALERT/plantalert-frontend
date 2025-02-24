import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

const FetchingTimer = ({progress = 0, max = 100, color = ""}) => {
    const progressWidth = Math.max(0, Math.min(progress / max, 1)) * 100;
    const progressAnim = useRef(new Animated.Value(0)).current; // Animated value

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progressWidth,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [progressWidth]);

    return (
        <View style={styles.container}>
            <View style={[styles.barBackground, {backgroundColor: color}]}>
                <Animated.View style={[styles.barForeground, { width: progressAnim.interpolate({
                        inputRange: [10, 100],
                        outputRange: ['0%', '100%']
                    }) }]} >
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: 'center',
        overflow: 'visible',
        height: 5,
    },
    barBackground: {
        overflow: 'visible',
        height: "100%",
        backgroundColor: '#e0e0e0',
        position: 'relative',
    },
    barForeground: {
        height: '100%',
        backgroundColor: 'green',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 1,
    },

});

export default FetchingTimer;
