import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {View, Text, StyleSheet, OpaqueColorValue, ActivityIndicator} from 'react-native';
import {getColors} from "@/constants/Colors";

import {IconSymbolName} from "@/components/ui/IconSymbol"

let colors = getColors();

const InfoCard = ({iconName, cardTitle, iconColor, value}: {iconName: IconSymbolName, cardTitle: string, value?: string, iconColor?: string
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <IconSymbol name={iconName} color={iconColor ?? "black"} size={24} />
            </View>
            <View>
                <Text style={styles.title}>{cardTitle}</Text>
                {value ?
                    <Text style={styles.value}>{value}</Text> : <ActivityIndicator style={{alignItems: "flex-start"}} size="small" color={colors.tabIconSelected}/>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
        padding: 16,
        shadowColor: colors.shadow,
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
        color: colors.text,
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.subtitle,
    },
});

export default InfoCard;
