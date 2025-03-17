import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Modal, SafeAreaView, Image,
} from "react-native";
import {themesTypes, useTheme} from "@/components/ThemeProvider"
import InfoCard from "@/components/InfoCard";
import {translateToPercentage} from "@/utils/translator";
import {oneFlower, Sensor_Response} from "@/hooks/sensor";
import {returnEndpoint, fetching} from "@/utils/fetching";
import {router, useLocalSearchParams} from 'expo-router';
import FetchingTimer from "@/components/FetchingTimer";
import { IconSymbol } from "@/components/ui/IconSymbol";
import getGlobalStyles from "@/constants/styles"
import Chart from "@/components/Chart";
import {chart_GET, bulkChart} from "@/types/chart"

let FETCH_INTERVAL = 20;

export default function Flowerpage() {
    const {theme} = useTheme();
    const [sensor, setSensor] = useState<Sensor_Response>();
    const [countdown, setCountdown] = useState(FETCH_INTERVAL);
    const {mac, sensor_id, flower_id} = useLocalSearchParams();
    const [flower, setFlower] = useState<oneFlower>();
    const [lostSensorModal, setLostSensorModal] = useState(false);
    const [deleteSensorModal, setDeleteSensorModal] = useState(false);
    const [graphs, setGraphs] = useState<bulkChart>();

    let globalStyles = getGlobalStyles(theme)

    let time = 2;

    let styles = returnStyles(theme);

    let switchLostModal = () => {
        setLostSensorModal(!lostSensorModal);
    }

    let switchDeleteModal = () => {
        setDeleteSensorModal(!deleteSensorModal);
    }

    let fetchData: () => void;

    useEffect(() => {
        fetchData = async () => {
            fetching<Sensor_Response>(returnEndpoint("/sensors/last_data/" + mac)).then((sensorVariable) => {
                if (sensorVariable) {
                    setSensor(sensorVariable.body)
                }
            });
            if (flower_id != null)
            fetching<oneFlower>(returnEndpoint("/flower/" + flower_id)).then((
                flowerVariable
            ) => {
                if (flowerVariable) {
                        setFlower(flowerVariable.body)
                }

            })

            let chartSoil = await fetching<chart_GET[]>(returnEndpoint(`/chart/soil-humidity/${mac}/${time}`))
            let chartTemp = await fetching<chart_GET[]>(returnEndpoint(`/chart/temperature/${mac}/${time}`))
            let chartHumi = await fetching<chart_GET[]>(returnEndpoint(`/chart/air-humidity/${mac}/${time}`))
            let chartLight = await fetching<chart_GET[]>(returnEndpoint(`/chart/light/${mac}/${time}`))

            setGraphs({
                light: chartLight == undefined || chartLight.code == 404 ? null : chartLight?.body,
                soil: chartSoil == undefined || chartSoil.code == 404 ? null : chartSoil?.body,
                temperature: chartTemp == undefined || chartTemp.code == 404 ? null : chartTemp?.body,
                humidity: chartHumi == undefined || chartHumi.code == 404 ? null : chartHumi?.body,
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
                    <TouchableOpacity onPress={() => {
                        router.push({pathname: "/flowertemplate", params: {mac: mac, sensor_id: sensor_id, flower_id: flower ? flower.id : null}});
                    }}  style={[styles.flowerView, {alignContent: "center"}]}>
                        {flower && <Image
                            style={{
                                width: 30,
                                height: 30,
                                objectFit: "cover",
                                borderRadius: 25,
                                borderWidth: 1,
                                borderColor: "green"
                            }}
                            source={require("@/assets/images/chinese-money-plant.png")}
                            alt="Flower icon"
                        />}
                        <Text style={{fontSize: 15, textTransform: "uppercase", alignContent: "center", letterSpacing: 1.1, fontWeight: "600", color: "rgb(102, 102, 102)", paddingHorizontal: 10}}>{flower ? flower.name : "select prefab"}</Text>
                    </TouchableOpacity>
                    <View style={styles.infoCardContainer}>
                        <InfoCard cardTitle="Humadity of air" recommendedValue={flower ? {min: String(flower?.air_humidity?.min + " %"), max: String(flower?.air_humidity?.max  + " %")} : null} iconName="drop" value={sensor?.humidity ? `${sensor?.humidity} %` : null} />
                        <InfoCard cardTitle="Humadity of soil" recommendedValue={flower ? {min: String(flower?.soil_humidity?.min  + " %"), max: String(flower?.soil_humidity?.max  + " %")}: null}  iconName="drop" value={sensor?.soil ? `${translateToPercentage(Number(sensor?.soil))} %` : null}/>
                        <InfoCard cardTitle="Tempature" recommendedValue={flower ? {min: String(flower?.air_temperature?.min  + " °C"), max: String(flower?.air_temperature?.max  + " °C")} : null}  iconName="thermometer" value={sensor?.temp ? `${sensor?.temp} °C` : null}/>
                        <InfoCard cardTitle="Light" recommendedValue={flower ? {only_one: String(flower?.light + " lux")} : null} iconName="lightbulb" value={sensor?.light ? `${sensor?.light} lux` : null}/>
                    </View>
                    <View style={{display: "flex", gap: 10}}>
                        {graphs &&
                            (
                                <>
                                    <Text style={globalStyles.subtitle}> Light </Text>
                                    <Chart lines={graphs.light}/>
                                    <Text style={globalStyles.subtitle}> Soil humidity </Text>
                                    <Chart lines={graphs.soil}/>
                                    <Text style={globalStyles.subtitle}> Air humidity</Text>
                                    <Chart lines={graphs.humidity}/>
                                    <Text style={globalStyles.subtitle}> Temp </Text>
                                    <Chart lines={graphs.temperature}/>
                                </>
                            )
                        }

                    </View>
                    {/*sensor settings*/}
                    <View style={{display: "flex", flexDirection: "column", gap: 10}}>
                        <TouchableOpacity onPress={switchLostModal} style={styles.button}>
                            <Text style={globalStyles.title}>Lost sensor</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={switchDeleteModal} style={styles.button}>
                            <Text style={globalStyles.title}>Reset sensor</Text>
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
                        <Text style={[globalStyles.title, {color: theme.text}]}>Lost sensor</Text>
                        <View style={{display: "flex", gap: 10}}>
                            <Text style={{color: theme.text}}>Did your sensor lost wifi access? Or did you changed your wifi? Sensor will try to connect <Text style={globalStyles.bald}>10 times</Text>, then it will activate <Text style={globalStyles.bald}>lost mode</Text></Text>
                            <Text style={{color: theme.text}}>You can recover sensor from lost mode by connecting it to his <Text style={globalStyles.bald}>hostpot</Text> and setup its wifi again</Text>
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
                        <Text style={globalStyles.title}>Remove sensor</Text>
                        <View style={{display: "flex", gap: 10}}>
                            <Text style={{color: theme.text}}>After pushing this button, sensor will delete from user database and reset itself</Text>
                            <Text style={[globalStyles.bald, {color: theme.text}]}>THIS CANNOT BE REVERSED!</Text>
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
        flowerView: {
            borderColor: "green",
            borderRadius: 25,
            borderWidth: 3,
            padding: 2,
            display: "flex",
            flexDirection: "row",
            alignSelf: "center",
        }
    });

}

