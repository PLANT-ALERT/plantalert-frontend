import React, {useCallback, useEffect, useState} from "react";
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
import {useForm, Controller} from 'react-hook-form';
import {Picker} from "@react-native-picker/picker";
import {Wifi} from "@/types/wifi";
import {health, fetching, loginWifi} from "@/utils/fetching";
import {FieldValues} from "react-hook-form";
import { router } from "expo-router";
import {registerSensor} from "@/hooks/user";
import {IconSymbol} from "@/components/ui/IconSymbol";
import {themesTypes, useTheme} from "@/components/ThemeProvider";
import {useAuth} from "@/components/AuthProvider"

export default function AddSenzor() {
    const [wifiModal, setWifiModal] = useState<boolean>(false);
    const [wifiList, setWifiList] = useState<Array<Wifi>>();
    const [wifiSSID, setWifiSSID] = useState<string | undefined>(undefined);
    const [wifiConnected, setWifiConnected] = useState<boolean>(false);
    const [isConnectedToSensor, setIsConnectedToSensor] = useState(false);
    const {control, handleSubmit, formState: {errors}} = useForm();
    const [mac, setMac] = useState<string>();
    const [checkConnectionInterval, setCheckConnectionInterval] = useState<NodeJS.Timeout | null>(null);
    const [checkWifiListInterval, setCheckWifiListInterval] = useState<NodeJS.Timeout | null>(null);
    const {token} = useAuth();
    let {theme} = useTheme();

    let styles = returnStyle(theme);

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

            if (mac) {
                if (token) registerSensor(mac, token, data.name)
            }
        })
    }

    const toggleModal = () => {
        setWifiModal(!wifiModal);
    }


    const checkConnection = async () => {
        try {
            const isConnected = await health("http://192.168.4.1/health");
            setIsConnectedToSensor(isConnected);
            fetching<string>("http://192.168.4.1/mac").then((result) => {
                if (result) setMac(result.body);
            })
            updateWifiList();
        } catch (error) {
            setIsConnectedToSensor(false);
        }
    };

    const updateWifiList = async () => {
        console.log("Checking list");
        try {
            const wifiRes = await fetching<Array<Wifi>>("http://192.168.4.1/ssid");
            if (wifiRes) setWifiList(wifiRes.body);
        } catch (err) {
        }
    };

    useEffect(() => {
        const connectionInterval = setInterval(checkConnection, 2500);
        const wifiListInterval = setInterval(updateWifiList, 20000);

        // Uložíme intervaly do stavu
        setCheckConnectionInterval(connectionInterval);
        setCheckWifiListInterval(wifiListInterval);

        return () => {
            clearIntervals();
        }
    }, []);

    const clearIntervals = () => {
        if (checkConnectionInterval) {
            clearInterval(checkConnectionInterval);
            setCheckConnectionInterval(null);
        }
        if (checkWifiListInterval) {
            clearInterval(checkWifiListInterval);
            setCheckWifiListInterval(null);
        }
    };

    if (!token) {
        return (
            <TouchableWithoutFeedback onPress={()=> {router.push("/auth")}} >
                <View style={styles.container}>
                    <IconSymbol name="person" size={44} />
                    <Text style={styles.title}>Please login before setting sensors</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    if (isConnectedToSensor) {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss()
                }}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Enter your home WIFI credentials {isConnectedToSensor ? "true" : "false"}</Text>
                        <View style={{marginTop: 10}}></View>
                        <Controller
                            control={control}
                            name="ssid"
                            defaultValue={wifiSSID} // Set initial value for the Controller
                            rules={{
                                min: { value: 1, message: "Select SSID" },
                            }}
                            render={({ field }) => (
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
                                        placeholderTextColor={theme.text}
                                />
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
                                    placeholderTextColor={theme.text}
                                />
                            )}
                            name="password"
                            rules={{min: {value: 1, message:'You must enter password'}}}
                        />
                        {/*@ts-ignore*/}
                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                        <Controller
                            control={control}
                            render={({ field })  => (
                                <TextInput
                                    {...field}
                                    style={styles.input}
                                    placeholder="Sensor name"
                                    placeholderTextColor={theme.text}
                                />
                            )}
                            name="name"
                            rules={{min: {value: 1, message:'You must enter name'}}}
                        />
                        {/*@ts-ignore*/}
                        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

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
                    <View style={styles.modalBackground} >
                            <View style={styles.modalContent}>
                                <Text style={styles.title}>Choose your home wifi connection</Text>
                                <Picker
                                    selectedValue={wifiSSID}
                                    onValueChange={(itemValue) => {
                                            setWifiSSID(itemValue);
                                        }
                                    }
                                    itemStyle={{color: theme.text}}
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


    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.tabIconSelected}/>
            <Text style={styles.title}>Checking connection...</Text>
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

