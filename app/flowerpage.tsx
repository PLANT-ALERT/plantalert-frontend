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
import {Sensor_Response} from "@/hooks/sensor";
import {returnEndpoint, fetching} from "@/utils/fetching";
import {router, useLocalSearchParams} from 'expo-router';
import FetchingTimer from "@/components/FetchingTimer";
import {getTextStyles} from "@/constants/TextStyles"
import { IconSymbol } from "@/components/ui/IconSymbol";

let FETCH_INTERVAL = 10;

export default function Flowerpage() {
    const {theme} = useTheme();
    const [sensor, setSensor] = useState<Sensor_Response>();
    const [countdown, setCountdown] = useState(FETCH_INTERVAL);
    const {mac} = useLocalSearchParams();
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


    useEffect(() => {
        const fetchData = () => {
            fetching<Sensor_Response>(returnEndpoint("/sensors/last_data/" + mac)).then((sensor) => {
                if (sensor) setSensor(sensor.body);
            });
        };

        fetchData(); // Initial fetch

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    fetchData();
                    return FETCH_INTERVAL;
                }
                return prev - 1;
            });
        }, 1000);
    }, [mac])

    return (
        <SafeAreaView>
            <FetchingTimer progress={translateToPercentage(FETCH_INTERVAL - countdown, 0, 10)} max={100} />
            <ScrollView>
                <View style={{display: "flex", flexDirection: "column", gap: 10, padding: 15 }}>
                    <View style={styles.infoCardContainer}>
                        <InfoCard cardTitle="Air-Humadity" iconName="drop" value={`${sensor?.humidity} %`} iconColor="green"/>
                        <InfoCard cardTitle="Soil-Humadity" iconName="drop" value={`${translateToPercentage(Number(sensor?.soil))} %`} iconColor="green"/>
                        <InfoCard cardTitle="Air-Tempature" iconName="thermometer" iconColor="green" value={`${sensor?.temp} °C`}/>
                        <InfoCard cardTitle="Light" iconName="lightbulb" iconColor="green" value={`${sensor?.light} lux`}/>
                    </View>
                    {/*sensor settings*/}
                    <View style={{display: "flex", flexDirection: "column", gap: 10}}>
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
                >
                <View style={{position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)"}}>
                    <View style={{backgroundColor: "white", padding: 15, borderRadius: 15, display: "flex", maxWidth: "65%", gap: 20}}>
                        <TouchableOpacity onPress={switchLostModal} style={{position: "absolute", right: 10, top: 10, zIndex: 100}}><IconSymbol name="xmark"/></TouchableOpacity>
                        <Text style={text.title}>Lost sensor</Text>
                        <View style={{display: "flex", gap: 10}}>
                            <Text>Did your sensor lost wifi access? Or did you changed your wifi? Sensor will try to connect <Text style={text.bald}>10 times</Text>, then it will activate <Text style={text.bald}>lost mode</Text></Text>
                            <Text>You can recover sensor from lost mode by connecting it to his <Text style={text.bald}>hostpot</Text> and setup its wifi again</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setLostSensorModal(false);
                            router.push({pathname: "/reconnectsensor", params: {mac: mac}})
                        }} style={[styles.button, {flex: 0}]}>
                            <Text>
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
                    <View style={{backgroundColor: "white", padding: 15, borderRadius: 15, display: "flex", maxWidth: "65%", gap: 20}}>
                        <TouchableOpacity onPress={switchDeleteModal} style={{position: "absolute", right: 10, top: 10,zIndex: 100}}><IconSymbol name="xmark"/></TouchableOpacity>
                        <Text style={text.title}>Remove sensor</Text>
                        <View style={{display: "flex", gap: 10}}>
                            <Text>After pushing this button, sensor will delete from user database and reset itself</Text>
                            <Text style={text.bald}>THIS CANNOT BE REVERSED!</Text>
                        </View>
                        <TouchableOpacity style={[styles.button, {flex: 0}]}>
                            <Text>RESET SENSOR</Text>
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

