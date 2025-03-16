import {
    ActivityIndicator,
    Button,
    KeyboardAvoidingView,
    Modal, Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {Controller, useForm, FieldValues} from "react-hook-form";
import {Picker} from "@react-native-picker/picker";
import React, {useState, useEffect} from "react";
import {useTheme, themesTypes} from "@/components/ThemeProvider";
import {Wifi} from "@/types/wifi";
import {fetching} from "@/utils/fetching";
import getGlobalStyles from "@/constants/styles";


export default function SensorSetupForm(props: {
    isConnectedToSensor: boolean,
    onSubmit: (data: FieldValues) => void,
    error: string | null
    createSensor?: boolean
}) {

    let {createSensor, isConnectedToSensor, error, onSubmit} = props;
    let {theme} = useTheme();
    let styles = returnStyle(theme)
    let globalStyles = getGlobalStyles(theme)
    let [SSID, setSSID] = useState<string>()

    if (createSensor == null) {
        createSensor = false;
    }

    const {control, handleSubmit, formState: {errors}, setValue} = useForm({
        defaultValues: {
            ssid: "",
            password: "",
            name: ""
        }
    });
    const [wifiList, setWifiList] = useState<Array<Wifi> | null>(null);
    const [wifiModal, setWifiModal] = useState<boolean>(false);


    useEffect(() => {
        if (error != null)
            control._setErrors({password: {type: "validate", message: error}})

        let updateWifiListInterval = setInterval(updateWifiList, 10000);
        updateWifiList();

        // setWifiList([{
        //     ssid:"test",
        //     encryption:0
        // },{
        //     ssid:"test2",
        //     encryption:0
        // }])

        if (SSID) setValue<"ssid">("ssid", SSID);

        return () => {
            clearInterval(updateWifiListInterval)
        }
    }, [error, SSID])

    const toggleModal = () => {
        setWifiModal(!wifiModal);
    }

    const updateWifiList = async () => {
        // TODO: button updating list
        // TODO: border filling by time
        console.log("Checking list");
        try {
            const wifiRes = await fetching<Array<Wifi>>("http://192.168.4.1/ssid");
            if (wifiRes) setWifiList(wifiRes.body);
        } catch (err) {
        }
    };


    // bug, cant spread values from field, declared explicitly required

    return (
        <>
            <KeyboardAvoidingView style={styles.container}>
                <Text style={styles.title}>Enter your home WIFI credentials </Text>
                <View style={{marginTop: 10}}></View>
                <Controller
                    control={control}
                    name="ssid"
                    rules={{
                        min: {value: 1, message: "Select SSID"},
                    }}
                    render={({ field: { onChange, onBlur, value }}) => (
                        <Pressable style={[globalStyles.textInput, {display: "flex", alignItems: "center", justifyContent: "center"}]} onPress={wifiList ? toggleModal : undefined}>
                            {wifiList ? <TextInput
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                style={{width: "100%"}}
                                placeholder="SSID"
                                editable={false}
                                placeholderTextColor={theme.text}
                                pointerEvents="none"
                            /> : <ActivityIndicator color={theme.tabIconSelected}/>}
                        </Pressable>

                    )}
                />
                {errors.ssid && <Text style={styles.errorText}>{errors.ssid.message}</Text>}


                <Controller
                    control={control}
                    rules={{min: {value: 1, message: 'You must enter password'}}}
                    render={({ field: { onChange, onBlur, value }}) => (
                        <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={globalStyles.textInput}
                            placeholder="Password"
                            placeholderTextColor={theme.text}
                        />
                    )}
                    name="password"
                />
                {/*@ts-ignore*/}
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                {createSensor ?
                    (
                        <>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value }}) => (
                                    <TextInput
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        style={globalStyles.textInput}
                                        placeholder="Sensor name"
                                        placeholderTextColor={theme.text}
                                    />
                                )}
                                name="name"
                                rules={{min: {value: 1, message: 'You must enter sensors name'}}}
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                        </>
                    ) : null}

                {/* Submit Butonu */}
                <Button title="Submit" onPress={handleSubmit(onSubmit)}/>
            </KeyboardAvoidingView>

            <Modal
                visible={wifiModal}
                animationType="fade"
                transparent={true}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Choose your home wifi connection</Text>
                        {wifiList ? <Picker
                            onValueChange={(itemValue: string) => {
                                setSSID(itemValue);
                            }
                            }
                            selectedValue={SSID}
                            itemStyle={{color: theme.text}}
                        >
                            <Picker.Item label="Please select ssid" value="" enabled={false}/>
                            {wifiList.map((wifi, index) => (
                                <Picker.Item key={index} label={`${wifi.encryption != 0 ? "🔒" : ""} ${wifi.ssid} `}
                                             value={wifi.ssid}/>
                            ))}
                        </Picker> : null}
                        <Button title="enter" onPress={toggleModal}/>
                    </View>
                </View>
            </Modal>
        </>


    );
}


function returnStyle(theme: themesTypes) {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: theme.background,
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
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 10,
        }
    });

}

