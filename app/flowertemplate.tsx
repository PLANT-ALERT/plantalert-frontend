import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity, Image,
} from "react-native";
import {themesTypes, useTheme} from "@/components/ThemeProvider"
import {flower_GET, oneFlower} from "@/hooks/sensor";
import {returnEndpoint, fetching} from "@/utils/fetching";
import {router, useLocalSearchParams} from 'expo-router';
import {parseLocalParameterToNumber} from "@/utils/parser";
import {useAuth} from "@/components/AuthProvider";
import {User_Interface} from "@/types/user";

type FlowerCardProps = {
    theme: themesTypes;
    flowerID: number | null;
    flower: oneFlower;
    setFlowerID: (id: number | null) => void;
    showUser?: boolean;
};

export function FlowerCard({ theme, flowerID, flower, setFlowerID, showUser }: FlowerCardProps) {
    const styles = returnStyles(theme)
        const [user, setUser] = useState<User_Interface | null>(null);

    useEffect(() => {
        if (showUser)
        fetching<User_Interface>(returnEndpoint("/users/" + Number(flower.user_id))).then((user) => {
            if (user) setUser(user.body)
        })


    }, [])

    return (
        <TouchableOpacity style={[
            styles.button,
            flowerID === flower.id && styles.selectedButton
        ]} onPress={() => {
            if (flower.id === flowerID)
                setFlowerID(null)
            else
                setFlowerID(flower.id)
        }} key={flower.id}>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                <View style={{display: "flex", flexDirection: "column"}}>
                    <Text style={{color: theme.text, fontSize: 17, display: "flex"}}>
                        {flower.name}
                    </Text>
                    {showUser ? (
                        <View style={[styles.userView, {marginTop: 5}]}>
                            {flower && <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    objectFit: "cover",
                                    borderRadius: 25,
                                    borderWidth: 1,
                                    borderColor: "green"
                                }}
                                source={user?.image && require("@/assets/images/blank.png")}
                                alt="Flower icon"
                            />}
                            <Text style={{fontSize: 15, alignContent: "center", paddingHorizontal: 10}}>{user?.username}</Text>
                        </View>
                    ) : null
                    }
                </View>

                <View style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    {flower.soil_humidity && (
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 5}}>
                            <Text style={styles.title}>SOIL</Text>
                            <Text>({flower.soil_humidity.min}) % - ({flower.soil_humidity.max}) %</Text>
                        </View>
                    )}
                    {flower.air_humidity && (
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 5}}>
                            <Text style={styles.title}>AIR</Text>
                            <Text>({flower.air_humidity.min}) % - ({flower.air_humidity.max}) %</Text>
                        </View>

                    )}
                    {flower.air_temperature && (
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 5}}>
                            <Text style={styles.title}>TEMP</Text>
                            <Text>({flower.air_temperature.min}) °C - ({flower.air_temperature.max}) °C</Text>
                        </View>
                    )}
                    {flower.light && (
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 5}}>
                            <Text style={styles.title}>LIGHT</Text>
                            <Text>{flower.light} lux</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default function FlowerTemplate() {
    const {theme} = useTheme();
    const [userFlowers, setUserFlowers] = useState<oneFlower[]>();
    const [defaultFlowers, setDefaultFlowers] = useState<oneFlower[]>();
    const [otherFlowers, setOtherFlowers] = useState<oneFlower[]>();
    const [flowerID, setFlowerID] = useState<number| null>(null);
    const {mac, sensor_id, flower_id} = useLocalSearchParams();

    const {token} = useAuth();

    let styles = returnStyles(theme);


    let handleSubmit = async () => {
        let body = {sensor_id: parseLocalParameterToNumber(sensor_id), flower_id: flowerID}

        console.log(body)

        await fetching(returnEndpoint("/sensors/flower"), "PUT", body)
        router.back()
    }

    useEffect(() => {
        fetching<flower_GET>(returnEndpoint("/flower?user_id=" + token)).then((flower) => {
            if (flower) {
                if (flower.body.user_flowers) {
                    setUserFlowers(flower.body.user_flowers)
                }
                if (flower.body.default_flowers) {
                    setDefaultFlowers(flower.body.default_flowers)
                }
                if (flower.body.other_flowers) {
                    setOtherFlowers(flower.body.other_flowers)
                }
            }
        });

        if (flower_id) {
            setFlowerID(parseLocalParameterToNumber(flower_id));
        }
    }, [mac])

    return (
        <ScrollView>
            <View style={{backgroundColor: theme.background, width: "100%", flexDirection: "column", gap: 10, padding: 10}}>
                <TouchableOpacity style={[
                    styles.upperView
                ]} onPress={() => {
                    router.push({pathname: "/createtemplate"});
                }}> <Text style={{fontSize: 12, textTransform: "uppercase", alignContent: "center", letterSpacing: 1.1, fontWeight: "600", color: "rgb(102, 102, 102)", paddingHorizontal: 10}}>Create my own flower template</Text></TouchableOpacity>
                {Array.isArray(userFlowers) && userFlowers.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>your templates</Text>
                        {userFlowers.map((flower, index) => (
                            <FlowerCard
                                key={index}
                                theme={theme}
                                flower={flower}
                                flowerID={flowerID}
                                setFlowerID={setFlowerID}

                            />
                        ))}
                    </>
                )}

                {Array.isArray(defaultFlowers) && defaultFlowers.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>default templates</Text>
                        {defaultFlowers.map((flower, index) => (
                            <FlowerCard
                                key={index}
                                theme={theme}
                                flower={flower}
                                flowerID={flowerID}
                                setFlowerID={setFlowerID}
                            />
                        ))}
                    </>
                )}
                {Array.isArray(otherFlowers) && otherFlowers.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>templates of other users</Text>
                        {otherFlowers.map((flower, index) => (
                            <FlowerCard
                                key={index}
                                theme={theme}
                                flower={flower}
                                flowerID={flowerID}
                                setFlowerID={setFlowerID}
                                showUser
                            />
                        ))}
                    </>
                )}
            <TouchableOpacity onPress={handleSubmit} style={[styles.button, {width: "50%", alignSelf: "center", justifyContent: "center", borderColor: "green", backgroundColor: "rgba(0, 153, 51, 0.07)"}]}> <Text style={{color: theme.text}}>Submit</Text></TouchableOpacity>
            </View>
            </ScrollView>
    );
}


function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
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
        selectedButton : {
            borderColor: "black",
        },
        title: {
            fontSize: 10,
            fontWeight: "bold",
            color: "grey",
        },
        upperView: {
            borderColor: "green",
            borderRadius: 25,
            borderWidth: 3,
            padding: 10,
            display: "flex",
            flexDirection: "row",
            alignSelf: "center",

        },
        sectionTitle: {
            paddingTop: 12,
            fontSize: 12,
            fontWeight: "600",
            color: "#9e9e9e",
            textTransform: "uppercase",
            letterSpacing: 1.1,
        },
        userView: {
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

