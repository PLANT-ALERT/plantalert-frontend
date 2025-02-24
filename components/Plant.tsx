import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import ProgressBar from "@/components/ProgressBar"
import {router} from "expo-router";
import {translateToPercentage} from "@/utils/translator"
import {useTheme, themesTypes} from "./ThemeProvider"
import {fetching, returnEndpoint} from "@/utils/fetching"


export default function PlantCard(props: {name: string, age: string, image?: string, mac: string}) {
    const {name, age, image, mac} = props;
    let [humidity, setHumidity] = useState<number>();
    let {theme} = useTheme();
    let styles = returnStyles(theme)

    useEffect(() => {
        fetching<number>(returnEndpoint("/sensors/last_data/humidity/") + mac).then((humidity) => {
             if (humidity) {
                 setHumidity(humidity.body)
                 console.log(humidity?.code)
             }
        })
    }, [mac]);

    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    if (humidity)
                    router.push({pathname: "/flowerpage", params: {mac: mac}})
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
                        <Text style={{ fontSize: 17, fontWeight: '500', color: theme.subtitle, fontStyle: 'italic'}}>Zasazeno: {age}</Text>
                    </View>
                </View>
                {humidity && (
                    <ProgressBar color={"white"} progress={translateToPercentage(humidity, 0, 100)} max={100} />
                )}
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
            backgroundColor: theme.background,
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

