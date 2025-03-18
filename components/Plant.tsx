import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import {Sensor} from "@/types/user";
import ProgressBar from "@/components/ProgressBar"
import {router} from "expo-router";
import {translateToPercentage} from "@/utils/translator"
import {useTheme, themesTypes} from "./ThemeProvider"
import {fetching, returnEndpoint} from "@/utils/fetching"

export default function PlantCard(props: {sensor: Sensor}) {
    const {name, age, created_at, flower_id, id, mac_address, image} = props.sensor;
    let [humidity, setHumidity] = useState<number>();
    let {theme} = useTheme();
    let styles = returnStyles(theme)

    useEffect(() => {
        fetching<number>(returnEndpoint("/sensors/last_data/humidity/") + mac_address).then((humidity) => {
             if (humidity) {
                 setHumidity(humidity.body)
             }
        })
    }, [mac_address]);

    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    router.push({pathname: "/flowerpage", params: {mac: mac_address, flower_id: flower_id, sensor_id: id}})
                }}
                style={styles.card}
            >
                <View style={styles.wrapper}>
                    <Image
                        style={styles.image}
                        source={image ?? require("@/assets/images/chinese-money-plant.png")}
                        alt="Plant Icon"
                    />
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>{name}</Text>
                        <Text style={{ fontSize: 17, fontWeight: '500', color: theme.subtitle, fontStyle: 'italic'}}>Zasazeno: {age ? String(getDate(age)) : `${String(created_at)}`}</Text>
                    </View>
                </View>
                {(humidity && humidity > 0) ? (
                    <ProgressBar color={"white"} progress={translateToPercentage(humidity, 350, 575)} />
                ) : null}
            </TouchableOpacity>
        </>
    );
}

function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
        wrapper: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        card: {
            flexDirection: 'column',
            padding: 10,
            borderRadius: 12,
            backgroundColor: theme.card,
            borderWidth: 2,
            borderColor: theme.border,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 5,
        },
        image: {
            width: 80, // Fixed width for the image
            height: 80, // Fixed height for the image
            resizeMode: 'contain', // Properly scale the image
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',

        },
        modalBackground: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        },
        modalContent: {
            maxHeight: "70%",
            backgroundColor: theme.background,
            borderRadius: 12,
            padding: 20,
            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 10,
        },
        chartsContainer: {
            flexShrink: 1,
            flex: 1,
            width: "100%",
        },
        infoCardRow: {
            flexDirection: 'row',
            // flex: 1,
            width: '100%',
            justifyContent: 'space-between',
        },
        row: {
            display: "flex",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

}

