import React, {useEffect, useState} from "react";

import Plant from "@/components/Plant";
import {StyleSheet, ScrollView, View, SafeAreaView, ActivityIndicator, Text} from "react-native";
import {Sensor} from "@/types/user";
import {fetching, returnEndpoint} from "@/utils/fetching";
import {useTheme} from "@/components/ThemeProvider";
import {useAuth} from "@/components/AuthProvider";


export default function HomeScreen() {
    const [sensors, setSensors] = useState<Sensor[] | null>();
    const [sensorsLoading, setSensorsLoading] = useState(true);
    let {theme} = useTheme();
    let {token} = useAuth();

    useEffect(() => {
        if (token) {
            let endpoint = returnEndpoint("/sensors?user_id=" + token);

            fetching<Sensor[]>(endpoint).then((sensorslist) => {
                if (sensorslist) {
                    console.log("fetched");
                    setSensors(sensorslist.body)
                    setSensorsLoading(false);
                }
            })
        } else {
            setSensors(null)
        }
    }, [token]);

    if (!token) return (
        <View style={styles.container}>
            <Text>You aren't logged in :(</Text>
        </View>
    )

    if (sensorsLoading)
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.tabIconSelected}/>
        </View>
    )

    if (!sensors) return (
        <View style={styles.container}>
            <Text>Please add sensors</Text>
        </View>
    )

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView>
                <View style={styles.wrapper}>
                    {sensors.map((sensor, index) => (
                        <Plant key={index} name={sensor.name} mac={sensor.mac_address} age={"21-1-2025"}/>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: 15,
        gap: 20,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
});

