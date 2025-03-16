import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableWithoutFeedback, Modal, Button,
} from "react-native";
import {health, saveWifiLogin} from "@/utils/fetching";
import {FieldValues} from "react-hook-form";
import { router } from "expo-router";
import {registerSensor} from "@/hooks/user";
import {IconSymbol} from "@/components/ui/IconSymbol";
import {themesTypes, useTheme} from "@/components/ThemeProvider";
import {useAuth} from "@/components/AuthProvider"
import * as Network from 'expo-network';
import SensorSetupForm from "@/components/SensorSetupForm";

export default function AddSenzor() {
    const [error, setError] = useState<string | null>(null);
    const [isConnectedToSensor, setIsConnectedToSensor] = useState(false);
    const [savedWifi, setSavedWifi] = useState<boolean>(false);
    const [mac, setMac] = useState<string>();
    const [name, setName] = useState<string>();
    const {token} = useAuth();
    let {theme} = useTheme();

    let styles = returnStyle(theme);

    const onSubmit = async (data: FieldValues) => {
        console.log('Submitted Data:', data);

        let res = await saveWifiLogin("http://192.168.4.1/saveCredentials", data.ssid, data.password);

        if (res.status === 400) {
            setError("SSID or Password not filled")
            return;
        }

        if (res.status === 200 && mac && token) {
            setSavedWifi(true)
            setName(data.name)
            await fetch("http://192.168.4.1/connect")

        }
    };

    const handleConnection = async () => {
        if (mac && token && name) {
            await registerSensor(mac, token, name)
        }
        router.push("/");
    }

    const checkConnection = async () => {
        if (!savedWifi)
            try {
                const isConnected = await health("http://192.168.4.1/health");
                setIsConnectedToSensor(isConnected);
                const macResponse = await fetch("http://192.168.4.1/mac", {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain',
                    },
                })
                setMac(await macResponse.text())
            } catch (error) {
                if (!savedWifi)
                    setIsConnectedToSensor(false);
            }
    };

    useEffect(() => {
        const connectionInterval = setInterval(checkConnection, 2500);

        if (savedWifi) {
            clearInterval(connectionInterval);
        }

        return () => {
            clearInterval(connectionInterval);
        }
    }, [savedWifi]);


    if (!token) {
        return (
            <TouchableWithoutFeedback onPress={()=> {router.push("/auth")}} >
                <View style={styles.container}>
                    <IconSymbol name="person" size={44} />
                    <Text style={styles.title}>Please login before setting up sensors</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    if (savedWifi || isConnectedToSensor) return (
        <>
            <SensorSetupForm createSensor isConnectedToSensor={isConnectedToSensor} error={error} onSubmit={onSubmit}/>
            <Modal
                animationType="fade"
                transparent={true}
                visible={savedWifi}
                >
                <View style={{position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)"}}>
                    <View style={{backgroundColor: theme.background, borderWidth: 5, borderColor: theme.border, padding: 15, borderRadius: 15, display: "flex", maxWidth: "65%", gap: 20}}>
                        <Text>Successful wifi setup</Text>
                        {/*cz verze: nyní můžete zahájit připojení k WIFI, pokud připojení selže, prosím nastavte wifi znova v části Lost Sensor v nastavení vašeho sensoru*/}
                        <Text>you can now start the WIFI connection, if the connection fails, please set up the wifi again in the Lost Sensor section of your sensor settings</Text>
                        <Text>Before, please connect back to internet</Text>
                        <Button title="Connect" onPress={handleConnection} />
                    </View>
                </View>

            </Modal>
        </>
    )

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.tabIconSelected}/>
            <Text style={styles.title}>Checking connection... </Text>
            <Text style={styles.subtitle}>Please connect to sensor wifi connection</Text>
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

