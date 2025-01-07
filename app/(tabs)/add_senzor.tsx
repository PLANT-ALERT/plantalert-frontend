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
import * as Network from "expo-network";
import {IconSymbol} from "@/components/ui/IconSymbol"; // Your custom component
import {getColors} from "@/constants/Colors";
import {useForm, Controller} from 'react-hook-form';
import {Picker} from "@react-native-picker/picker";
import {getData, storeData} from "@/hooks/setStorageData";
import {Wifi} from "@/types/wifi";

let colors = getColors();

let debug = true;

export default function AddSenzor() {
    const [wifiModal, setWifiModal] = useState<boolean>(true);
    const [wifiList, setWifiList] = useState<Array<Wifi>>([]);
    const [wifiSSID, setWifiSSID] = useState<string | null>(null);
    const [isConnectedToSensor, setIsConnectedToSensor] = useState(false);
    const {control, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = (data) => {
        // Simulate form submission
        console.log('Submitted Data:', data);

    };

    const toggleModal = () => {
        setWifiModal(!wifiModal);
    }

    useEffect(() => {
        const checkConnection = async () => {

            try {
                // Get network state
                const networkState = await Network.getNetworkStateAsync();
                const {type, isConnected, isInternetReachable} = networkState;

                // Only proceed if connected to WiFi
                if (type === "WIFI" && isConnected) {
                    // Attempt to ping the ESP8266 endpoint (replace with your ESP's IP)
                    const sensorEndpoint = "http://192.168.4.1/health"; // Example endpoint
                    try {
                        const response = await fetch(sensorEndpoint, {method: "GET"});
                        if (response.status === 200) {
                            setIsConnectedToSensor(true);
                        } else {
                            setIsConnectedToSensor(false);
                        }
                    } catch (err) {
                        // Unable to reach the sensor
                        setIsConnectedToSensor(false);
                    }
                } else {
                    setIsConnectedToSensor(false);
                }
            } catch (error) {
                console.error("Error checking network state:", error);
                setIsConnectedToSensor(false);
            } finally {

            }
        };

        // Poll every 3 seconds to check the connection
        const interval = setInterval(checkConnection, 3000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    if (isConnectedToSensor || debug) {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss()
                }}>


                    <View style={styles.container}>
                        <Text style={styles.title}>Enter your home WIFI credentials</Text>
                        <View style={{marginTop: 10}}></View>
                        <Controller
                            control={control}
                            render={({field}) => (
                                <TextInput
                                    {...field}
                                    onPress={toggleModal}
                                    value={wifiSSID ?? ""}
                                    style={styles.input}
                                    placeholder="SSID"
                                    editable={false}
                                    placeholderTextColor={colors.text}
                                />

                            )}
                            name="name"
                            rules={{required: 'Select SSID'}}

                        />

                        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                        <Controller
                            control={control}
                            render={({field}) => (
                                <TextInput
                                    {...field}
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor={colors.text}
                                />
                            )}
                            name="password"
                            rules={{required: 'You must enter password'}}
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                        {/* Submit Butonu */}
                        <Button title="Submit" onPress={handleSubmit(onSubmit)}/>


                    </View>
                </TouchableWithoutFeedback>

                <Modal
                    visible={wifiModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={toggleModal}

                >
                    <View style={styles.modalBackground}>
                        <TouchableWithoutFeedback style={styles.modalContainer} onPress={toggleModal}>
                            <View style={styles.modalContent}>
                                <Text style={styles.title}>Choose your home wifi connection</Text>
                                <Picker

                                    itemStyle={{color: colors.text}}
                                >
                                    <Picker.Item label="Dark" value="dark"  />
                                    <Picker.Item label="Light" value="light" />
                                    <Picker.Item label="System" value="auto" />
                                </Picker>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
            </>


        );
    }

    if (!debug)
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.tabIconSelected}/>
                <Text style={styles.title}>Checking connection...</Text>
                <Text style={styles.subtitle}>Please connect to senzor wifi connection</Text>
            </View>
        );

}

const styles = StyleSheet.create({
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
        color: colors.text,
    },
    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 10,
        color: colors.subtitle,
    },
    input: {
        height: 50,
        borderColor: colors.border,
        backgroundColor: colors.background,
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
        backgroundColor: colors.background,
        zIndex: 1,
    },
    modalBackground: {
        zIndex: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    }
});
