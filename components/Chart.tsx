import React, {useState} from 'react';
import {IconSymbol} from '@/components/ui/IconSymbol';
import {View, Text, StyleSheet, LayoutChangeEvent, ScrollView} from 'react-native';
import {getColors} from "@/constants/Colors";
import LineChart, {Line} from 'react-native-simple-line-chart';
import {IconSymbolName} from "@/components/ui/IconSymbol"
import {GestureHandlerRootView} from "react-native-gesture-handler";

let colors = getColors();

const Chart = ({lines}: { lines: Line[] }) => {
    return (
        <GestureHandlerRootView style={styles.container}>
            <LineChart
                width={300}
                lines={lines}
            />
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
        padding: 16,
        shadowColor: colors.shadow,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 4,
    }
});

export default Chart;
