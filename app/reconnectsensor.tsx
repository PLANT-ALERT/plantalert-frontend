import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    TextInput,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard, Modal
} from "react-native";
import {health, fetching, saveWifiLogin} from "@/utils/fetching";
import {FieldValues} from "react-hook-form";
import {themesTypes, useTheme} from "@/components/ThemeProvider";
import {useLocalSearchParams, router} from "expo-router";
import {macAddressToHotspotName} from "@/utils/mac"
import SensorSetupForm from "@/components/SensorSetupForm";

export default function ReconnectSensor() {
    const [error, setError] = useState<string | null>(null);
    const [isConnectedToSensor, setIsConnectedToSensor] = useState(false);
    const [checkConnectionInterval, setCheckConnectionInterval] = useState<NodeJS.Timeout | null>(null);
    const [checkWifiListInterval, setCheckWifiListInterval] = useState<NodeJS.Timeout | null>(null);
    const {mac} = useLocalSearchParams();
    let {theme} = useTheme();

    let styles = returnStyle(theme);

    const onSubmit = async ( data : FieldValues ) => {
        console.log('Submitted Data:', data);

        let res = await saveWifiLogin("http://192.168.4.1/saveCredentials", data.ssid, data.password);

        if (res.status === 401) {
            setError("SSID or Password not filled up");
        }

        await fetching<null>("http://192.168.4.1/connect")

        router.push("/")
    }

    const checkConnection = async () => {
        try {
            const isConnected = await health("http://192.168.4.1/health");
            setIsConnectedToSensor(isConnected);
        } catch (error) {
            setIsConnectedToSensor(false);
        }
    };


    useEffect(() => {
        const connectionInterval = setInterval(checkConnection, 2500);

        setCheckConnectionInterval(connectionInterval);

        return () => {
            clearInterval(connectionInterval);
        }
    }, []);

    if (isConnectedToSensor) {
        return <SensorSetupForm isConnectedToSensor={isConnectedToSensor} error={error} onSubmit={onSubmit}/>
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.tabIconSelected}/>
            <Text style={styles.title}>Checking connection...</Text>
            <Text style={styles.subtitle}>Please connect to sensor wifi connection: {macAddressToHotspotName(String(mac))}</Text>
        </View>
    );

}

function returnStyle(theme : themesTypes) {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
            color: theme.text,
        },
        subtitle: {
            fontSize: 18,
            textAlign: "center",
            marginTop: 10,
            color: theme.subtitle,
        },
        input: {
            height: 50,
            borderColor: theme.border,
            backgroundColor: theme.background,
            borderRadius: 8,
            marginBottom: 12,
            paddingHorizontal: 12,
            width: "100%",
        },
        errorText: {
            color: 'red',
            marginBottom: 10,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        },
        modalBackground: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalContent: {
            backgroundColor: theme.background,
            borderRadius: 12,
            padding: 15,
            justifyContent: 'center',
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 10,
        }
    });

}

