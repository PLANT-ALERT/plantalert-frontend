import {useState} from "react";
import Login from "@/components/auth/login"
import Register from "@/components/auth/register"
import {Keyboard, StyleSheet, TouchableWithoutFeedback, View, Switch, Text} from "react-native";
import textStyles from "@/constants/TextStyles"

export default function Auth() {
    const [register, setRegister] = useState<boolean>(false)

    const toggleRegister = () => {
        setRegister(!register)
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss()
        }} >
            <View style={styles.container}>
                {register ? <Register /> : <Login />}
                <View style={styles.switchContainer}>
                    <Text style={textStyles.subtitle}>I dont have an account </Text>
                    <Switch
                        onValueChange={toggleRegister}
                        value={register}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        paddingTop: 100,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    switchContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
        gap: 15,
    }

});