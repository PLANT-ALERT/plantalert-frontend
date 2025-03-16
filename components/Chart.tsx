import React from 'react';
import { StyleSheet, Dimensions, View, Text} from 'react-native';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {chart_GET} from "@/types/chart";
import {themesTypes, useTheme} from "@/components/ThemeProvider"

const Chart = ({lines}: { lines: chart_GET[] | null }) => {
    let {theme} = useTheme();
    let styles = returnStyles(theme);

    return (
        <GestureHandlerRootView style={styles.container}>
            {lines ? (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>

                </View>
            ) : (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginVertical: 15, gap: 15}}>
                    <Text style={{fontSize: 20}}>Data not available</Text>
                    <Text>Data aren't available. Graphs shows only when sensor was connected for past 2 weeks</Text>
                </View>
            )}
        </GestureHandlerRootView>
    );
};

function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
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
