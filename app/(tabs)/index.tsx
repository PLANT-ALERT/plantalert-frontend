import React, {useEffect, useState} from "react";

import Plant from "@/components/Plant";
import {StyleSheet, ScrollView, View, SafeAreaView, ActivityIndicator, Text} from "react-native";
import {Sensor} from "@/types/user";
import {fetching, returnEndpoint} from "@/utils/fetching";
import {useTheme} from "@/components/ThemeProvider";
import {useAuth} from "@/components/AuthProvider";
import {registerIndieID} from "native-notify";
import { NOTIFICATION_ID_FIRST, NOTIFICATION_ID_SECOND } from "@/utils/enviroment";

export default function HomeScreen() {
    const [sensors, setSensors] = useState<Sensor[] | null>();
    const [sensorsLoading, setSensorsLoading] = useState(true);
    let {theme} = useTheme();
    let {token} = useAuth();

    let interval: NodeJS.Timeout;

    useEffect(() => {
        const fetchSensors = () => {
            fetching<Sensor[]>(returnEndpoint("/sensors?user_id=" + token))
                .then((sensorslist) => {
                    if (sensorslist) {
                        setSensors(sensorslist.body);
                    } else {
                        setSensors(null);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching sensors:", error);
                    setSensors(null);
                })
                .finally(() => {
                    setSensorsLoading(false);
                });
        }
        if (token) {
            registerIndieID(token, NOTIFICATION_ID_FIRST, NOTIFICATION_ID_SECOND);

            fetchSensors();
            interval = setInterval(fetchSensors, 10000);
        } else {
            setSensors(null);
            setSensorsLoading(false);
        }

        return () => {
            clearInterval(interval)
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
                            <Plant key={index} sensor={sensor} />
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

