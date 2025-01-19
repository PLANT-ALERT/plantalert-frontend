import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    TextInput,
} from "react-native";
import {getColors} from "@/constants/Colors";
import {useForm, Controller} from 'react-hook-form';
import {login} from "@/hooks/user";
import {saveToken} from "@/hooks/tokenHandle"

let colors = getColors();
import {FieldValues} from "react-hook-form";

export default function Login() {
    const {control, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = async (data: FieldValues) => {
        let response = await login(data.username, data.password);

        if (response.status == 200) {
            const jsondata: {user_id: number} = await response.json();

            saveToken(jsondata.user_id.toString());


        }
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                <View style={{marginTop: 10}}></View>
                <Controller
                    control={control}
                    name="username"
                    rules={{
                        min: {value: 1, message: "Enter username"},
                    }}
                    render={({field}) => (
                        <>
                            <TextInput
                                {...field}
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor={colors.text}
                                textContentType={"username"}
                            />
                        </>
                    )}
                />
                {/*@ts-ignore*/}
                {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

                <Controller
                    control={control}
                    render={({field}) => (
                        <TextInput
                            {...field}
                            style={styles.input}
                            placeholder="Password"
                            textContentType={"password"}
                            placeholderTextColor={colors.text}
                        />
                    )}
                    name="password"
                    rules={{min: {value: 1, message: 'You must enter password'}}}
                />
                {/*@ts-ignore*/}
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                {/* Submit Butonu */}
                <Button title="Submit" onPress={handleSubmit(onSubmit)}/>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
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
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    }
});
