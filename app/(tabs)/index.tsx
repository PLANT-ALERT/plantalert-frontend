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
                  <Plant name="Aconitum" age={"10-9-2024"} progress={20} />
                  <Plant name="Akácie" age={"29-9-2024"} progress={80} />

                  {sensors?.map((sensor) => (
                      <Plant name={sensor.name} progress={15} age={sensor.created_at.toString()}/>
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

