import React from 'react';
import { StyleSheet, Dimensions, View, Text} from 'react-native';
import LineChart from 'react-native-simple-line-chart';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {chart_GET} from "@/types/chart";
import {themesTypes, useTheme} from "@/components/ThemeProvider"

const Chart = ({lines}: { lines: chart_GET[] }) => {
    let {theme} = useTheme();
    let styles = returnStyles(theme);

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <LineChart
                    lines={
                        [
                            {
                                data: lines.map((line) => ({x: new Date(line.x).getTime(), y: line.y, extraData: line.extraData})),
                                curve: "linear",
                                lineColor: "black",
                                activePointConfig: {
                                    color: 'black',
                                    showVerticalLine: true,
                                },
                                endPointConfig: {
                                    color: 'green',
                                    radius: 2,
                                    animated: true,
                                },
                                activePointComponent: (point) => {
                                    return (
                                        <View
                                            style={{
                                                backgroundColor: theme.tint,
                                                padding: 10,
                                                borderRadius: 10,
                                            }}
                                        >
                                            <Text style={{ color: theme.text }}>
                                                {point?.extraData?.formattedValue}
                                            </Text>
                                            <Text style={{ color: theme.text }}>
                                                {point?.extraData?.formattedTime}
                                            </Text>
                                        </View>
                                    );
                                },
                            }

                        ]
                    }
                    height={200}
                    width={300}
                />
            </View>

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
