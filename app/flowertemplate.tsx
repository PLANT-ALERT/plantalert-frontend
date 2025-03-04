import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import {themesTypes, useTheme} from "@/components/ThemeProvider"
import {flower_GET, sensors_GET} from "@/hooks/sensor";
import {returnEndpoint, fetching} from "@/utils/fetching";
import {router, useLocalSearchParams} from 'expo-router';
import {getTextStyles} from "@/constants/TextStyles"
import {parseLocalParameterToNumber} from "@/utils/parser";

let FETCH_INTERVAL = 10;

export default function FlowerTemplate() {
    const {theme} = useTheme();
    const [flowers, setFlowers] = useState<flower_GET[]>();
    const [flowerID, setFlowerID] = useState<number| null>();
    const {mac, sensor_id, flower_id} = useLocalSearchParams();

    let styles = returnStyles(theme);

    let text = getTextStyles(theme);

    let handleSubmit = async () => {
        let body = {sensor_id: parseLocalParameterToNumber(sensor_id), flower_id: flowerID}

        console.log(body)

        await fetching(returnEndpoint("/sensors/flower"), "PUT", body)
        router.back()
    }

    useEffect(() => {
        fetching<flower_GET[]>(returnEndpoint("/flower")).then((flower) => {
            if (flower) setFlowers(flower.body);
            });

    }, [mac])

    return (
        <SafeAreaView style={{backgroundColor: theme.background, flex: 1, flexDirection: "column", gap: 10, padding: 10}}>
            {flowers && flowers.map((flower) => (
                <TouchableOpacity style={[
                    styles.button,
                    flowerID === flower.id && styles.selectedButton
                ]} onPress={() => {
                    if (flower.id === flowerID)
                        setFlowerID(null)
                    else
                        setFlowerID(flower.id)
                }}>
                    <Text style={{color: theme.text}}>
                        {flower.name}

                    </Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={handleSubmit} style={[styles.button, {width: "50%", alignSelf: "center", justifyContent: "center", borderColor: "green", backgroundColor: "rgba(0, 153, 51, 0.07)"}]}> <Text style={{color: theme.text}}>Submit</Text></TouchableOpacity>
        </SafeAreaView>
    );
}

function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
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
        selectedButton : {
            borderColor: "black",
        }
    });

}

