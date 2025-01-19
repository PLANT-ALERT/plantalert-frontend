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
import {getColors} from "@/constants/Colors";
import {useForm, Controller} from 'react-hook-form';
import {Picker} from "@react-native-picker/picker";
import {Wifi} from "@/types/wifi";
import {health, fetching, loginWifi} from "@/utils/fetching";
let colors = getColors();
import {FieldValues} from "react-hook-form";

let debug = false;

export default function AddSenzor() {
    const [wifiModal, setWifiModal] = useState<boolean>(false);
    const [wifiList, setWifiList] = useState<Array<Wifi>>();
    const [wifiSSID, setWifiSSID] = useState<string | undefined>(undefined);
    const [wifiConnected, setWifiConnected] = useState<boolean>(false);
    const [isConnectedToSensor, setIsConnectedToSensor] = useState(false);
    const {control, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = ( data : FieldValues ) => {
        // Simulate form submission
        console.log('Submitted Data:', data);

        let res = loginWifi("http://192.168.4.1/connect", data.ssid, data.password);

        res.then((result) => {
            if (result.status === 200) {
                setWifiConnected(true)
            }

            if (result.status === 401) {
                control._setErrors({password: {type: "validate", message: "Wrong password"}})
            }
        })

    }

    const toggleModal = () => {
        setWifiModal(!wifiModal);
    }

    useEffect(() => {
        let checkConnectionInterval: NodeJS.Timeout;
        let checkWifiListInterval: NodeJS.Timeout;

        const checkConnection = async () => {
            try {
                const isConnected = await health("http://192.168.4.1/health");
                setIsConnectedToSensor(isConnected);
                updateWifiList();
            } catch (error) {
                console.error("Error checking network state:", error);
                setIsConnectedToSensor(false);
            }

        };

        const updateWifiList = async () => {
            try {
                const wifiRes = await fetching<Array<Wifi>>("http://192.168.4.1/ssid");
                setWifiList(wifiRes);

            } catch (err) {

            }
        }

        checkConnectionInterval = setInterval(checkConnection, 2500); // Adjust interval
        checkWifiListInterval = setInterval(updateWifiList, 20000);

        // Clean up interval on unmount
        return () => {
            clearInterval(checkConnectionInterval);
            clearInterval(checkWifiListInterval);
        };
    }, []);

    if (isConnectedToSensor || debug) {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss()
                }}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Enter your home WIFI credentials {wifiConnected}</Text>
                        <View style={{marginTop: 10}}></View>
                        <Controller
                            control={control}
                            name="ssid"
                            defaultValue={wifiSSID} // Set initial value for the Controller
                            rules={{
                                min: { value: 1, message: "Select SSID" },
                            }}
                            render={({ field }) => (
                                <>
                                    <TextInput
                                        {...field}
                                        value={field.value} // Bind the Controller's value
                                        onPress={() => {
                                            toggleModal();
                                            field.onChange(wifiSSID); // Update the Controller's value
                                        }}
                                        style={styles.input}
                                        placeholder="SSID"
                                        editable={false} // Prevent manual input
                                        placeholderTextColor={colors.text}
                                    />
                                </>
                            )}
                        />
                        {/*@ts-ignore*/}
                        {errors.ssid && <Text style={styles.errorText}>{errors.ssid.message}</Text>}

                        <Controller
                            control={control}
                            render={({ field })  => (
                                <TextInput
                                    {...field}
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor={colors.text}
                                />
                            )}
                            name="password"
                            rules={{min: {value: 1, message:'You must enter password'}}}
                        />
                        {/*@ts-ignore*/}
                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                        {/* Submit Butonu */}
                        <Button title="Submit" onPress={handleSubmit(onSubmit)}/>
                        {debug ? (<>
                                <Text>health: {isConnectedToSensor ? "OK" : "BAD RESPONSE"}</Text>
                                <Text>LIST: {wifiList ? wifiList.map((item) => (<Text> {item.ssid},</Text>)) : "nothin"}</Text>
                            </>

                        ) : null

                        }
                    </View>

                </TouchableWithoutFeedback>

                <Modal
                    visible={wifiModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={toggleModal}
                >
                    <View style={styles.modalBackground} >
                            <View style={styles.modalContent}>
                                <Text style={styles.title}>Choose your home wifi connection</Text>
                                <Picker
                                    selectedValue={wifiSSID}
                                    onValueChange={(itemValue) => {
                                            setWifiSSID(itemValue);
                                        }
                                    }
                                    itemStyle={{color: colors.text}}
                                >
                                    {wifiList ? wifiList.map((wifi, index) => (
                                        <Picker.Item key={index} label={`${wifi.security != 0 ? "🔒" : null} ${wifi.ssid} `} value={wifi.ssid}   />
                                    )): null}

                                </Picker>
                                <Button title="enter" onPress={toggleModal} />
                            </View>
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
                <Text style={styles.subtitle}>Please connect to sensor wifi connection</Text>
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
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 15,
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    }
});
