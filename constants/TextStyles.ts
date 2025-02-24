import {StyleSheet} from "react-native";
import {themesTypes} from "@/components/ThemeProvider";

export function getTextStyles(colors: themesTypes) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            color: colors.text,
        },
        subtitle: {
            fontSize: 18,
            textAlign: "center",
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
    });
}