import Plant from "@/components/Plant";

import {StyleSheet, ScrollView, View, SafeAreaView} from "react-native";

export default function HomeScreen() {
  return (
      <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
              <View style={styles.wrapper}>
                  <Plant name="Aconitum" age={"10-9-2024"} progress={20} />
                  <Plant name="Akácie" age={"29-9-2024"} progress={80} />
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

