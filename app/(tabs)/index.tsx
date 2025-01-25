import {useEffect, useState} from "react";

import Plant from "@/components/Plant";
import {StyleSheet, ScrollView, View, SafeAreaView} from "react-native";

import {Sensor} from "@/types/user";
import {getToken} from "@/hooks/tokenHandle";
import {fetching, returnEndpoint} from "@/utils/fetching";
import {useTheme} from "@/components/ThemeProvider";

export default function HomeScreen() {
    const [token, setToken] = useState<string>();
    const [sensors, setSensors] = useState<Sensor[]>();

    let {theme} = useTheme();

    useEffect(() => {
        getToken().then((res) => {
            if (res)
            fetching<Sensor[]>(returnEndpoint("/sensors/?user_id=" + Number(res))).then((senlist) => {
                if (senlist)
                setSensors(senlist.body)
            })
        })

    }, [])

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          <ScrollView>
              <View style={styles.wrapper}>
                  {sensors?.map((sensor) => (
                      <Plant name={sensor.name} mac={sensor.mac_address} age={"21-1-2025"}/>
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

