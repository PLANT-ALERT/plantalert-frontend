import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Modal, SafeAreaView,
} from "react-native";
import {themesTypes, useTheme} from "@/components/ThemeProvider"
import InfoCard from "@/components/InfoCard";
import {translateToPercentage} from "@/utils/translator";
import {flower_GET, Sensor_Response} from "@/hooks/sensor";
import {returnEndpoint, fetching} from "@/utils/fetching";
import {router, useLocalSearchParams} from 'expo-router';
import FetchingTimer from "@/components/FetchingTimer";
import {getTextStyles} from "@/constants/TextStyles"
import { IconSymbol } from "@/components/ui/IconSymbol";
import Chart from "@/components/Chart";

let FETCH_INTERVAL = 20;

export default function Flowerpage() {
    const {theme} = useTheme();
    const [sensor, setSensor] = useState<Sensor_Response>();
    const [countdown, setCountdown] = useState(FETCH_INTERVAL);
    const {mac, sensor_id} = useLocalSearchParams();
    const [flower, setFlower] = useState<flower_GET>();
    const [lostSensorModal, setLostSensorModal] = useState(false);
    const [deleteSensorModal, setDeleteSensorModal] = useState(false);

    let styles = returnStyles(theme);

    let text = getTextStyles(theme);

    let switchLostModal = () => {
        setLostSensorModal(!lostSensorModal);
    }

    let switchDeleteModal = () => {
        setDeleteSensorModal(!deleteSensorModal);
    }

    let fetchData: () => void;

    useEffect(() => {
        fetchData = () => {
            fetching<Sensor_Response>(returnEndpoint("/sensors/last_data/" + mac)).then((sensor) => {
                if (sensor) setSensor(sensor.body);
            });
            fetching<flower_GET>(returnEndpoint("/sensors/flower?sensor_id=" + sensor_id)).then((flower) => {
                if (flower) setFlower(flower.body)
            })
        };

        fetchData();

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    fetchData();
                    return FETCH_INTERVAL;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [mac])

    return (
        <SafeAreaView style={{backgroundColor: theme.background, flex: 1}}>
            <FetchingTimer progress={translateToPercentage(FETCH_INTERVAL - countdown, 0, FETCH_INTERVAL)} max={100} />
            <ScrollView>
                <View style={{display: "flex", flexDirection: "column", gap: 10, padding: 15 }}>
                    <View style={styles.button}>
                        <Text style={text.subtitle}>
                            Using prefab: <Text style={text.title}>{flower?.name}</Text>
                        </Text>
                    </View>
                    <View style={styles.infoCardContainer}>
                        <InfoCard cardTitle="Humadity of air" recommendedValue={{min: String(flower?.air_humidity?.min + " %"), max: String(flower?.air_humidity?.max  + " %")}} iconName="drop" value={`${sensor?.humidity} %`} />
                        <InfoCard cardTitle="Humadity of soil" recommendedValue={{min: String(flower?.soil_humidity?.min  + " %"), max: String(flower?.soil_humidity?.max  + " %") }}  iconName="drop" value={`${translateToPercentage(Number(sensor?.soil))} %`}/>
                        <InfoCard cardTitle="Tempature" recommendedValue={{min: String(flower?.air_temperature?.min  + " °C"), max: String(flower?.air_temperature?.max  + " °C")}}  iconName="thermometer" value={`${sensor?.temp} °C`}/>
                        <InfoCard cardTitle="Light" recommendedValue={{only_one: String(flower?.light + " lux")}} iconName="lightbulb" value={`${sensor?.light} lux`}/>
                    </View>
                    <View>
                        {/*<Chart lines={}/>*/}


                    </View>
                    {/*sensor settings*/}
                    <View style={{display: "flex", flexDirection: "column", gap: 10}}>
                        <TouchableOpacity onPress={() => {
                            router.push({pathname: "/flowertemplate", params: {mac: mac, sensor_id: sensor_id}});
                        }} style={styles.button}>
                            <Text style={text.title}>Flower template</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={switchLostModal} style={styles.button}>
                            <Text style={text.title}>Lost sensor</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={switchDeleteModal} style={styles.button}>
                            <Text style={text.title}>Reset sensor</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={lostSensorModal}
                style={{backgroundColor: theme.background}}
                >
                <View style={{position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)"}}>
                    <View style={{backgroundColor: theme.background, borderColor: theme.border, padding: 15, borderRadius: 15, borderWidth: 2, display: "flex", maxWidth: "65%", gap: 20}}>
                        <TouchableOpacity onPress={switchLostModal} style={{position: "absolute", right: 10, top: 10, zIndex: 100}}><IconSymbol name="xmark"/></TouchableOpacity>
                        <Text style={[text.title, {color: theme.text}]}>Lost sensor</Text>
                        <View style={{display: "flex", gap: 10}}>
                            <Text style={{color: theme.text}}>Did your sensor lost wifi access? Or did you changed your wifi? Sensor will try to connect <Text style={text.bald}>10 times</Text>, then it will activate <Text style={text.bald}>lost mode</Text></Text>
                            <Text style={{color: theme.text}}>You can recover sensor from lost mode by connecting it to his <Text style={text.bald}>hostpot</Text> and setup its wifi again</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setLostSensorModal(false);
                            router.push({pathname: "/reconnectsensor", params: {mac: mac}})
                        }} style={[styles.button, {flex: 0}]}>
                            <Text style={{color: theme.text}}>
                                Setup wifi again
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={deleteSensorModal}
                onRequestClose={() => {
                    switchDeleteModal()
                }}>
                <View style={{position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)"}}>
                    <View style={{backgroundColor: theme.background, borderWidth: 5, borderColor: theme.border, padding: 15, borderRadius: 15, display: "flex", maxWidth: "65%", gap: 20}}>
                        <TouchableOpacity onPress={switchDeleteModal} style={{position: "absolute", right: 10, top: 10,zIndex: 100}}><IconSymbol name="xmark"/></TouchableOpacity>
                        <Text style={text.title}>Remove sensor</Text>
                        <View style={{display: "flex", gap: 10}}>
                            <Text style={{color: theme.text}}>After pushing this button, sensor will delete from user database and reset itself</Text>
                            <Text style={[text.bald, {color: theme.text}]}>THIS CANNOT BE REVERSED!</Text>
                        </View>
                        <TouchableOpacity style={[styles.button, {flex: 0}]}>
                            <Text style={{color: theme.text}}>RESET SENSOR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>

    );
}

function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
        infoCardContainer: {
            display: "flex",
            flexDirection: "column",
            gap: 10,
        },
        button: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: theme.card,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: theme.border,
            padding: 15,
        },
    });

}

