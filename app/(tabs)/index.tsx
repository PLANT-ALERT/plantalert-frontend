import {useEffect, useState} from "react";

import Plant from "@/components/Plant";
import {StyleSheet, ScrollView, View, SafeAreaView} from "react-native";

import {Sensor} from "@/types/user";
import {getToken} from "@/hooks/tokenHandle";
import {get_sensors} from "@/hooks/user"

export default function HomeScreen() {

    const [sensors, setSensors] = useState<Sensor[]>();

    useEffect(() => {
        getToken().then((res) => {
            if (res) get_sensors(res).then((x => setSensors(x)));
        })
    }, [])

  return (
      <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
              <View style={styles.wrapper}>


                  {sensors?.map((sensor) => (
                      <Plant name={sensor.name} mac={sensor.mac_address} progress={15} age={sensor.created_at.getDay() + "-" + sensor.created_at.getDate() + "-" + sensor.created_at.getFullYear()}/>
                  ))}
              </View>
          </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: 15,
        gap: 20,
    }
});

