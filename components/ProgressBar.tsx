import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icons, IconTypes} from "@/components/icons/Icons";


const ProgressBar = ({progress = 0, max = 100}) => {
    const progressWidth = Math.max(0, Math.min(progress / max, 1)) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.barBackground}>
                <View style={[styles.barForeground, {width: `${progressWidth}%`}]}>
                    <View style={styles.icon}>
                        <Icons name={IconTypes.DROP} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        overflow: 'visible',
        borderRadius: 12,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    icon: {
        position: 'absolute',
        height: 25,
        width: 25,
        transform: "translate(25%, -75%)",
        zIndex: 2,

    },
    barBackground: {
        overflow: 'visible',
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        position: 'relative',
    },
    barForeground: {
        height: '100%',
        backgroundColor: '#3498db',
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 1,
    },

});

export default ProgressBar;