import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
} from "react-native";
import {themesTypes, useTheme} from "@/components/ThemeProvider"
import InfoCard from "@/components/InfoCard";
import {translateToPercentage} from "@/utils/translator";
import {Sensor_Response} from "@/hooks/sensor";
import {returnEndpoint, fetching} from "@/utils/fetching";
import { useLocalSearchParams } from 'expo-router';
import FetchingTimer from "@/components/FetchingTimer";

let FETCH_INTERVAL = 10;

export default function Flowerpage() {
    const {theme} = useTheme();
    const [sensor, setSensor] = useState<Sensor_Response>();
    const [countdown, setCountdown] = useState(FETCH_INTERVAL);
    const {mac} = useLocalSearchParams();

    let styles = returnStyles(theme);


    useEffect(() => {
        const fetchData = () => {
            fetching<Sensor_Response>(returnEndpoint("/sensors/last_data/" + mac)).then((sensor) => {
                if (sensor) setSensor(sensor.body);
            });
        };

        fetchData(); // Initial fetch

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    fetchData();
                    return FETCH_INTERVAL;
                }
                return prev - 1;
            });
        }, 1000);
    }, [mac])

    return (
        <>
            <FetchingTimer progress={translateToPercentage(FETCH_INTERVAL - countdown, 0, 10)} max={100} />
            <ScrollView >
                <View style={{display: "flex", flexDirection: "column", gap: 10, padding: 15 }}>
                    <View style={styles.infoCardContainer}>
                        <InfoCard cardTitle="Air-Humadity" iconName="drop" value={`${sensor?.humidity} %`} iconColor="green"/>
                        <InfoCard cardTitle="Soil-Humadity" iconName="drop" value={`${translateToPercentage(Number(sensor?.soil))} %`} iconColor="green"/>
                        <InfoCard cardTitle="Air-Tempature" iconName="thermometer" iconColor="green" value={`${sensor?.temp} °C`}/>
                        <InfoCard cardTitle="Light" iconName="lightbulb" iconColor="green" value={`${sensor?.light} lux`}/>
                    </View>
                    {/*sensor settings*/}
                    <View style={{display: "flex", flexDirection: "column", gap: 10}}>
                        <TouchableOpacity style={styles.button}>
                            <Text></Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </>

    );
}

function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
        infoCardContainer: {
            display: "flex",
            flexDirection: "column",
            gap: 10,
        },
        button: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: theme.card,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: theme.border,
            padding: 15,
        },
    });

}

