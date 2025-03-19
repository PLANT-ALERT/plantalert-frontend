import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {themesTypes, useTheme} from "@/components/ThemeProvider";
import {IconSymbolName} from "@/components/ui/IconSymbol"
import GradiatedProgressBar from "@/components/ProgressBarValued";


const InfoCard = ({iconName, cardTitle, value, recommendedValue, carne}: {iconName: IconSymbolName, carne: string ,cardTitle: string, value: number | null, recommendedValue?: {
        min?: number | null
        max?: number | null
        only_one?: number | null
    } | null
}) => {
    let {theme} = useTheme();
    let styles = returnStyles(theme);

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
                        <Text style={styles.value}>{value ? value + carne : "Sensor didnt sent any data"}</Text> : <ActivityIndicator style={{alignItems: "flex-start"}} size="small" color={theme.tabIconSelected}/>
                    }
                    </View>

                </View>
                <View style={{width: "50%", flexDirection: "column"}}>
                    {(recommendedValue && recommendedValue.min && recommendedValue.max && value) ?
                        <>
                            <GradiatedProgressBar progress={value} min={recommendedValue.min} max={recommendedValue.max} />
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={styles.value}>{recommendedValue.min + carne}</Text>
                                <Text style={styles.value}>{recommendedValue.max + carne}</Text>
                            </View>
                        </>
                        : null}
                    {(recommendedValue && recommendedValue.only_one) ?
                        <Text style={styles.recommendedValue}>recommended {recommendedValue.only_one} lux</Text>
                        : null }

                </View>
            </View>
        </View>
    );
};

function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
        card: {
            backgroundColor: theme.card,
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
            color: theme.text,
        },
    });
}



export default InfoCard;
