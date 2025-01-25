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
import {FieldValues} from "react-hook-form";
import {saveToken} from "@/hooks/tokenHandle"
import {fetching, returnEndpoint} from "@/utils/fetching";
import {router} from "expo-router";

let colors = getColors();

export default function Register({onSwitch}: { onSwitch: () => void }) {
    const {control, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = async (data: FieldValues) => {
        let {username, password, email} = data;
        let response = await fetching<{user_id: number}>(returnEndpoint('/register/'), true, {username: username, password: password, email: email});
        if (response) {
            saveToken(response.body.user_id.toString());
            onSwitch();
            router.back();
        }
    }


    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Register</Text>
                <View style={{marginTop: 10}}></View>
                <Controller
                    control={control}
                    name="username"
                    rules={{
                        required: { value: true, message: "Username is required" },
                        minLength: { value: 3, message: "Username must be at least 3 characters" },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor="#999"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {/*@ts-ignore*/}
                {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

                <Controller
                control={control}
                name="email"
                rules={{
                required: { value: true, message: "Email is required" },
                minLength: { value: 3, message: "Email must be at least 3 characters" },
            }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                />
            )}
                />

                {/*@ts-ignore*/}
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                {/* Password Input */}
                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: { value: true, message: "Password is required" },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {/*@ts-ignore*/}
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <Button title="Submit" onPress={handleSubmit(onSubmit)} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
        width: '100%',
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
