import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {View, Text, StyleSheet, OpaqueColorValue, ActivityIndicator} from 'react-native';


import {themesTypes, useTheme} from "@/components/ThemeProvider";
import {IconSymbolName} from "@/components/ui/IconSymbol"


const InfoCard = ({iconName, cardTitle, iconColor, value}: {iconName: IconSymbolName, cardTitle: string, value?: string, iconColor?: string
}) => {
    let {theme} = useTheme();
    let styles = returnStyles(theme);

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <IconSymbol name={iconName} color={iconColor ?? "black"} size={24} />
            </View>
            <View>
                <Text style={styles.title}>{cardTitle}</Text>
                {value ?
                    <Text style={styles.value}>{value}</Text> : <ActivityIndicator style={{alignItems: "flex-start"}} size="small" color={theme.tabIconSelected}/>
                }
            </View>
        </View>
    );
};

function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
        card: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.border,
            padding: 16,
            shadowColor: theme.shadow,
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            elevation: 4,
        },
        iconContainer: {
            marginRight: 16,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.text,
        },
        value: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.subtitle,
        },
    });
}



export default InfoCard;
