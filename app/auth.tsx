import {useState} from "react";
import Login from "@/components/auth/login"
import Register from "@/components/auth/register"
import {Keyboard, StyleSheet, TouchableWithoutFeedback, View, Switch, Text, KeyboardAvoidingView, Platform} from "react-native";
import getGlobalStyles from "@/constants/styles"
import {useTheme} from "@/components/ThemeProvider"

export default function Auth() {
    const [register, setRegister] = useState<boolean>(false)
    let {theme} = useTheme();
    let globalStyles = getGlobalStyles(theme);

    const toggleRegister = () => {
        setRegister(!register)
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {register ? <Register onSwitch={toggleRegister} /> : <Login />}
                <View style={styles.switchContainer}>
                    <Text style={globalStyles.subtitle}>I don't have an account</Text>
                    <Switch
                        onValueChange={toggleRegister}
                        value={register}
                    />
                </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        paddingTop: 100,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 5000
    },
    switchContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 50,
        gap: 15,
    }
});