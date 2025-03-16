import { StyleSheet } from 'react-native';
import {themesTypes} from '@/components/ThemeProvider';

function getGlobalStyles(theme: themesTypes) {
    return StyleSheet.create({
        textInput: {
            height: 50,
            borderColor: theme.border,
            backgroundColor: theme.card,
            borderRadius: 8,
            marginBottom: 12,
            paddingHorizontal: 12,
            width: "100%",
        },
        bald: {
            fontWeight: "bold",
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            color: theme.text,
        },
        subtitle: {
            fontSize: 18,
            textAlign: "center",
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
    })
}


export default getGlobalStyles;
