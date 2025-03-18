import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {chart_GET} from "@/types/chart";
import {themesTypes, useTheme} from "@/components/ThemeProvider"
import {
    LineChart,
} from "react-native-chart-kit";
import {translateToPercentage} from "@/utils/translator";

const Chart = (props: { lines: chart_GET[] | null, isHumidity?: boolean, suffix?: string | null}) => {
    let {lines, isHumidity = false, suffix} = props;
    let {theme} = useTheme();
    let styles = returnStyles(theme);
    const [points, setPoints] = React.useState<number[]>([]);

    let arrayOfPoints: number[] = [];

    useEffect(() => {
        let arrayOfPoints: number[] = [];

        if (lines) {
            lines.forEach((line) => {
                let value = line.y;
                if (!isNaN(value) && value > 0 && value < 1000) {
                    if (isHumidity) {
                        value = translateToPercentage(value, 350, 600);
                    }
                    if (!isNaN(value) && isFinite(value)) {
                        arrayOfPoints.push(value);
                    }

                }
            });
        }
        setPoints(arrayOfPoints);
    }, [lines]);


    return (
        <GestureHandlerRootView style={styles.container}>
            {lines && points.length > 0 ? (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <LineChart
                        data={{
                            labels: ["12 hours", "6 hours", "1 hour"],
                            datasets: [
                                {
                                    data: points.length ? points : [0, 0, 0] // fallback dummy data
                                }
                            ]
                        }}
                        width={(Dimensions.get("window").width / 100) * 85}
                        height={220}
                        yAxisSuffix={suffix ? suffix : "%"}
                        chartConfig={{
                            color: () => `rgb(0, 0, 0)`,
                            backgroundGradientFrom: "white",
                            backgroundGradientTo: "white"
                        }}
                        bezier
                        style={{
                            backgroundColor: "transparent",
                        }}
                    />
                </View>
            ) : (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginVertical: 15, gap: 15}}>
                    <Text style={{fontSize: 20, color: theme.text}}>Data not available</Text>
                    <Text style={{color: theme.text}}>Data aren't available. Graphs shows only when sensor was connected for past hour</Text>
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
            backgroundColor: theme.card,
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
