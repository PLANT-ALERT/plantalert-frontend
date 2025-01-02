import Plant from "@/components/Plant";

import {StyleSheet, ScrollView, View} from "react-native";

export default function HomeScreen() {
  return (
      <ScrollView>
          <View style={styles.wrapper}>
              <Plant name="konvalinka" age={"10-9-2024"} progress={20} />
              <Plant name="tomasova prdel" age={"29-9-2024"} progress={80} />

          </View>
      </ScrollView>
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

