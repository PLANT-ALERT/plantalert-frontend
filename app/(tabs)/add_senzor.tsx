import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {getColors} from "@/constants/Colors";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {getColorReverseIcon} from "@/utils/theme";

let colors = getColors();

export default function AddSenzor() {

    return (
        <View style={styles.container}>
            <MaterialIcons name="wifi-tethering" size={120} color={getColorReverseIcon()} />
            <Text style={styles.title}>Connect to the Senzor Hotspot</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: colors.subtitle,
    },
});
