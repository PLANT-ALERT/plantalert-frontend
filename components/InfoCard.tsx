import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
// import {calculatePercentage} from "@/utils/parser"

import {themesTypes, useTheme} from "@/components/ThemeProvider";
import {IconSymbolName} from "@/components/ui/IconSymbol"


const InfoCard = ({iconName, cardTitle, value, recommendedValue}: {iconName: IconSymbolName, cardTitle: string, value: string | null, recommendedValue?: {
        min?: string | null
        max?: string | null
        only_one?: string | null
    } | null
}) => {
    let {theme} = useTheme();
    let styles = returnStyles(theme);

    // let precenteges = {
    //     only_one: recommendedValue.only_one ? calculatePercentage(Number(recommendedValue.only_one), 10) : null,
    //     min: recommendedValue.min ? calculatePercentage(Number(recommendedValue.min), 10) : null,
    //     max: recommendedValue.max ? calculatePercentage(Number(recommendedValue.max), 10) : null,
    // }

    return (
        <View style={styles.card}>
            <View style={{display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between"}}>
                <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <View style={styles.iconContainer}>
                        <IconSymbol name={iconName} size={24} />
                    </View>
                    <View style={{display: "flex", flexDirection: "column"}}>
                    <Text style={styles.title}>{cardTitle}</Text>
                    {value ?
                        <Text style={styles.value}>{value ? value : "Sensor didnt sent any data"}</Text> : <ActivityIndicator style={{alignItems: "flex-start"}} size="small" color={theme.tabIconSelected}/>
                    }
                    </View>
                </View>

                {recommendedValue ?
                    <View style={{display: "flex", flexDirection: "column"}}>
                        <Text style={styles.recommendedValue}>{returnTextForRecommendedValue(recommendedValue)}</Text>
                    </View>
                : null}
            </View>
        </View>
    );
};

function returnTextForRecommendedValue(recommendedValue: {
    min?: string | null
    max?: string | null
    only_one?: string | null
}) {
    if (recommendedValue.min && recommendedValue.max) {
        return `(${recommendedValue.min}) - (${recommendedValue.max})`;
    } else {
        return `(${recommendedValue.only_one})`;
    }
}

function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
        card: {
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
            fontSize: 13,
            fontWeight: 'bold',
            color: theme.text,
        },
        value: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.subtitle,
        },
        recommendedValue: {
            fontSize: 15,
        },
    });
}



export default InfoCard;
