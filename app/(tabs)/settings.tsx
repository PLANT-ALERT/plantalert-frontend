import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {User} from "@/types/user"
import { getColors } from "@/constants/Colors";
import { Collapsible } from "@/components/Collapsible";
import { router } from "expo-router";

import { storeData, getData } from "@/hooks/setStorageData";
import {getToken} from "@/hooks/tokenHandle";
import {get_user} from "@/hooks/user";

let colors = getColors();

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [languageForm, setLanguageForm] = useState<string>("auto");
  const [themeForm, setThemeForm] = useState<string>("auto");
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    getToken().then((res) => {
      setToken(res)
    });

    if (token)
      get_user(token).then((res) => {
        setUser(res)
      })
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.profile}>
        <TouchableOpacity
          onPress={() => {
            router.push("/auth");
          }}
        >{token ?
          <View style={styles.profileAvatarWrapper}>
            {user?.image ? (
                <Image
                    alt="Profile picture"
                    source={{uri: user.image}}
                    style={styles.profileAvatar}
                />
            ) : (
                <Image
                    alt="Profile picture"
                    source={require("@/assets/images/blank.png")}
                    style={styles.profileAvatar}
                />
            )}

            <Text style={styles.profileName}>{user?.username}</Text>
          </View> : <Text>Please login</Text>}
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Collapsible iconName="moon" text="Theme">
            <Picker
              selectedValue={themeForm}
              onValueChange={(itemValue, itemIndex) => {
                storeData({ storeKey: "theme", value: themeForm }).then(() => {
                  getData({ storeKey: "theme" }).then((r) => {
                    if (typeof r == "string") setThemeForm(r);
                  });
                });
                setThemeForm(itemValue);
              }}
              itemStyle={{ color: colors.text }}
            >
              <Picker.Item label="Dark" value="dark" />
              <Picker.Item label="Light" value="light" />
              <Picker.Item label="System" value="auto" />
            </Picker>
          </Collapsible>
          <Collapsible iconName="globe" text="Language">
            <Picker
              selectedValue={languageForm}
              onValueChange={(itemValue, itemIndex) => {
                storeData({ storeKey: "language", value: languageForm }).then(
                  () => {
                    getData({ storeKey: "language" }).then((r) => {
                      if (typeof r == "string") setLanguageForm(r);
                    });
                  }
                );
                setLanguageForm(itemValue);
              }}
              itemStyle={{ color: colors.text }}
            >
              <Picker.Item label="Czech" value="czech" />
              <Picker.Item label="English" value="english" />
              <Picker.Item label="System" value="auto" />
            </Picker>
          </Collapsible>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /** Profile */
  profile: {
    padding: 24,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarWrapper: {
    position: "relative",
    alignItems: "center",
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAction: {
    position: "absolute",
    right: -4,
    bottom: -10,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "#007bff",
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: colors.subtitle,
    textAlign: "center",
  },
  /** Section */
  section: {
    paddingHorizontal: 24,
    gap: 10,
  },
  sectionTitle: {
    paddingTop: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  /** Row */
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    color: colors.text,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
