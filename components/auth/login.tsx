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
import {router} from "expo-router";
import {fetching, returnEndpoint} from "@/utils/fetching";
import {useAuth} from "@/components/AuthProvider"
import {themesTypes, useTheme} from "@/components/ThemeProvider"

export default function Login() {
    const { control, setError, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: "",
            password: "",
        }
    });
    const {setToken} = useAuth();
    const {theme} = useTheme();

    let styles = returnStyles(theme);

    const onSubmit = async (data: FieldValues) => {
        let endpoint = returnEndpoint('/auth/login');

        let response = await fetching<{user_id: number}>(endpoint, "POST", {username: data.username, password: data.password});
        if (response?.code == 401) {
            setError("password", {type: "manual", message: "Wrong username or password"});
        } else if (response) {
            setToken(response.body.user_id.toString());
            router.back();
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                <View style={{marginTop: 10}}></View>

                <Controller
                    control={control}
                    rules={{
                        required: true,
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
                    name="username"
                />

                {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

                {/* Password Input */}
                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: { value: true, message: "Password is required" },
                    }}
                    render={({ field: { onChange, onBlur, value }}) => (
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

                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

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
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    }
});

}

