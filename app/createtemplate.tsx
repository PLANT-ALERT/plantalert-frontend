import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    TextInput
} from "react-native";
import {useForm, Controller} from 'react-hook-form';
import {FieldValues} from "react-hook-form";
import {useAuth} from "@/components/AuthProvider"
import {themesTypes, useTheme} from "@/components/ThemeProvider"
import {fetching, returnEndpoint} from "@/utils/fetching";
import {router} from "expo-router"

export default function CreateTemplate() {
    const { control, setError, handleSubmit, formState: { errors } } = useForm();
    const {token} = useAuth();
    const {theme} = useTheme();

    const styles = returnStyles(theme);

    const onSubmit = async (data: FieldValues) => {
        let endpoint = returnEndpoint('/flower');

        let response = await fetching<{user_id: number}>(endpoint, "POST",
            {
                user_id: token,
                name: data.name_of_flower,
                image: null,
                light: data.light,
                soil_humidity: {
                    min: data.min_humidity,
                    max: data.max_humidity,
                },
                air_humidity: {
                    min: data.min_air_humidity,
                    max: data.max_air_humidity
                },
                air_temperature: {
                    min: data.min_temperature,
                    max: data.max_temperature
                }
            }
            );
        if (response?.code == 200) {
            router.back();
        }
    }

    return (
        <>
            <View style={styles.container}>
                {/*name*/}
                <Controller
                    control={control}
                    name="name_of_flower"
                    rules={{
                        required: { value: true, message: "Name of flower is required" },
                        minLength: { value: 3, message: "Name must be at least 3 characters" },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Name of template"
                            placeholderTextColor="#999"
                            autoComplete="off"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {/*@ts-ignore*/}
                {errors.nameOfFlower && <Text style={styles.errorText}>{errors.nameOfFlower.message}</Text>}

                {/*min temp*/}

                <View style={{display: "flex", flexDirection: "row", width: "100%", gap: 5}}>
                    <View style={{width: "50%", flexShrink: 1}}>
                        <Controller
                            control={control}
                            name="min_temperature"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Minimal temperature"
                                    placeholderTextColor="#999"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="numeric"
                                />
                            )}
                        />
                        {/*@ts-ignore*/}
                        {errors.min_temp && <Text style={styles.errorText}>{errors.min_temp.message}</Text>}
                    </View>
                    {/*max temp*/}

                    <View style={{width: "50%", flexShrink: 1 }}>
                        <Controller
                            control={control}
                            name="max_temperature"
                            rules={{
                                pattern: {value: new RegExp("^\\d{1,2}$"), message: "Must be 2 digits number"}
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Maximal temperature"
                                    placeholderTextColor="#999"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="numeric"
                                />
                            )}
                        />
                        {/*@ts-ignore*/}
                        {errors.max_temp && <Text style={styles.errorText}>{errors.max_temp.message}</Text>}
                    </View>
                </View>
                {/*humidity*/}
                <View style={{display: "flex", flexDirection: "row", width: "100%", gap: 5}}>
                    <View style={{width: "50%", flexShrink: 1}}>
                        <Controller
                            control={control}
                            name="min_humidity"
                            rules={{
                                pattern: {value: new RegExp("^\\d{1,2}$"), message: "Must be 2 digits number"}
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Minimal soil humidity"
                                    placeholderTextColor="#999"

                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="numeric"

                                />
                            )}
                        />
                        {/*@ts-ignore*/}
                        {errors.min_humi && <Text style={styles.errorText}>{errors.min_humi.message}</Text>}
                    </View>
                    <View style={{width: "50%", flexShrink: 1}}>
                        <Controller
                            control={control}
                            name="max_humidity"
                            rules={{
                                pattern: {value: new RegExp("^\\d{1,2}$"), message: "Must be 2 digits number"}
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Maximal soil humidity"
                                    placeholderTextColor="#999"

                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    keyboardType="numeric"

                                    value={value}
                                />
                            )}
                        />
                        {/*@ts-ignore*/}
                        {errors.max_humi && <Text style={styles.errorText}>{errors.max_humi.message}</Text>}
                    </View>
                </View>
                <View style={{display: "flex", flexDirection: "row", width: "100%", gap: 5}}>
                    <View style={{width: "50%", flexShrink: 1}}>
                        <Controller
                            control={control}
                            name="min_air_humidity"
                            rules={{
                                pattern: {value: new RegExp("^\\d{1,2}$"), message: "Must be 2 digits number"}
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Minimal air humidity"
                                    placeholderTextColor="#999"

                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="numeric"

                                />
                            )}
                        />
                        {/*@ts-ignore*/}
                        {errors.min_air_humi && <Text style={styles.errorText}>{errors.min_air_humi.message}</Text>}
                    </View>
                    <View style={{width: "50%", flexShrink: 1}}>
                        <Controller
                            control={control}
                            name="max_air_humidity"
                            rules={{
                                pattern: {value: new RegExp("^\\d{1,2}$"), message: "Must be 2 digits number"}
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Maximal air humidity"
                                    placeholderTextColor="#999"

                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    keyboardType="numeric"

                                    value={value}
                                />
                            )}
                        />
                        {/*@ts-ignore*/}
                        {errors.max_air_humi && <Text style={styles.errorText}>{errors.max_air_humi.message}</Text>}
                    </View>
                </View>
                <View style={{width: "100%"}}>
                    <Controller
                        control={control}
                        name="light"
                        rules={{
                            pattern: {value: new RegExp("^\\d{1,4}$"), message: "Must be 2 digits number"}
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Light"
                                placeholderTextColor="#999"

                                onBlur={onBlur}
                                onChangeText={onChange}
                                keyboardType="numeric"

                                value={value}
                            />
                        )}
                    />
                    {/*@ts-ignore*/}
                    {errors.light && <Text style={styles.errorText}>{errors.light.message}</Text>}
                </View>
                <Button title="Submit" onPress={handleSubmit(onSubmit)} />
            </View>
        </>

    );
}
function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            padding: 25
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
            width: "100%"
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


