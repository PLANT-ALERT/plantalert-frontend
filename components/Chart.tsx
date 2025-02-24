import React from 'react';
import { StyleSheet} from 'react-native';
import LineChart, {Line} from 'react-native-simple-line-chart';
import {GestureHandlerRootView} from "react-native-gesture-handler";

import {themesTypes, useTheme} from "@/components/ThemeProvider"

const Chart = ({lines}: { lines: Line[] }) => {
    let {theme} = useTheme();
    let styles = returnStyles(theme);

    return (
        <GestureHandlerRootView style={styles.container}>
            <LineChart
                width={300}
                lines={lines}
            />
        </GestureHandlerRootView>
    );
};

function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
        scrollView: {
            flex: 1,
        },
        container: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.border,
            padding: 16,
            shadowColor: theme.shadow,
            shadowOpacity: 0.1,
            shadowOffset: {width: 0, height: 2},
            shadowRadius: 8,
            elevation: 4,
        }
    });

}


export default Chart;
