import React, {useState, useEffect} from "react";
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
import {User, User_Interface} from "@/types/user"
import { Collapsible } from "@/components/Collapsible";
import { router } from "expo-router";
import { storeData, getData } from "@/hooks/setStorageData";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { themesTypes, useTheme } from '@/components/ThemeProvider';
import { useAuth } from "@/components/AuthProvider";
import {fetching, returnEndpoint} from "@/utils/fetching";

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [languageForm, setLanguageForm] = useState<string>();
  const [themeForm, setThemeForm] = useState<string>();
  const {theme, toggleTheme} = useTheme();
  const {token, removeToken} = useAuth();

  let styles = returnStyle(theme);

  useEffect(() => {
    getData({ storeKey: "language" }).then((r) => {
      if (typeof r === "string") {
        setLanguageForm(r);
      }
    });

    getData({ storeKey: "theme" }).then((r) => {
      if (typeof r === "string") {
        setThemeForm(r);

      }
    });

    if (token)
      fetching<User_Interface>(returnEndpoint("/users/" + Number(token))).then((user) => {
        if (user) setUser(user.body)
      })

  }, [themeForm, languageForm, token]);


  return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.profile}>
          <TouchableOpacity
              onPress={() => {
                router.push("/auth");
              }}
          >{token ?
              <View style={styles.profileAvatarWrapper}>
                <Image
                    alt="Profile picture"
                    source={user?.image == "None" ? require("@/assets/images/blank.png") : user?.image}
                    style={styles.profileAvatar}
                />
                <Text style={styles.profileName}>{user?.username}</Text>
              </View> : null}
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <Collapsible iconName="moon" text="Theme">
              <Picker
                  selectedValue={themeForm}
                  onValueChange={(itemValue) => {
                    storeData({ storeKey: "theme", value: itemValue! }).then(() => {
                      getData({ storeKey: "theme" }).then((r) => {
                        if (typeof r == "string") setThemeForm(r);
                      });
                    });
                    setThemeForm(itemValue);
                    toggleTheme();
                  }}
                  itemStyle={{ color: theme.text }}
              >
                <Picker.Item label="Dark" value="dark" />
                <Picker.Item label="Light" value="light" />
                <Picker.Item label="System" value="auto" />
              </Picker>
            </Collapsible>
            <Collapsible iconName="globe" text="Language">
              <Picker
                  selectedValue={languageForm}
                  onValueChange={(itemValue) => {
                    storeData({ storeKey: "language", value: itemValue! }).then(
                        () => {
                          getData({ storeKey: "language" }).then((r) => {
                            if (typeof r == "string") setLanguageForm(r);
                          });
                        }
                    );
                    setLanguageForm(itemValue);
                  }}
                  itemStyle={{ color: theme.text }}
              >
                <Picker.Item label="Czech" value="czech" />
                <Picker.Item label="English" value="english" />
                <Picker.Item label="System" value="auto" />
              </Picker>
            </Collapsible>
            {token ?
                (<TouchableOpacity style={styles.row}  onPress={() => {
                  removeToken();
                  setUser(null);
                }}>
                  <View style={styles.rowIcon}>
                    <IconSymbol name="rectangle.portrait.and.arrow.right" size={20}/>
                  </View>
                  <Text style={styles.rowLabel}>
                    Sign out
                  </Text>

                </TouchableOpacity>) : (
                    <TouchableOpacity style={styles.row}  onPress={() => {
                      router.push("/auth");
                    }}>
                      <View style={styles.rowIcon}>
                        <IconSymbol name="person" size={20}  />
                      </View>
                      <Text style={styles.rowLabel}>
                        Sign in
                      </Text>

                    </TouchableOpacity>
                )
            }
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}

function returnStyle(theme : themesTypes) {
  return StyleSheet.create({
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
      color: theme.text,
      textAlign: "center",
    },
    profileAddress: {
      marginTop: 5,
      fontSize: 16,
      color: theme.subtitle,
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
      backgroundColor: theme.card,
      borderRadius: 8,
      marginBottom: 12,
      paddingHorizontal: 12,
      borderWidth: 2,
      borderColor: theme.border,
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
      color: theme.text,
    },
    rowSpacer: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
  });
}

