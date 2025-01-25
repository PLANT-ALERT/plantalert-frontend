import React, {useState, useEffect, useCallback} from "react";
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
import { Collapsible } from "@/components/Collapsible";
import { router } from "expo-router";
import { storeData, getData } from "@/hooks/setStorageData";
import {deleteToken, getToken} from "@/hooks/tokenHandle";
import {get_user} from "@/hooks/user";
import {IconSymbol} from "@/components/ui/IconSymbol";
import { useFocusEffect } from '@react-navigation/native';
import {themesTypes, useTheme} from '@/components/ThemeProvider';


export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [languageForm, setLanguageForm] = useState<string>();
  const [themeForm, setThemeForm] = useState<string>();
  const { theme, toggleTheme } = useTheme();

  let styles = returnStyle(theme);

  const checkLogin = () => {
    getToken().then((res) => {
      if (res)
        get_user(res).then((userres) => {
          if (userres)
          setUser(userres)
        })
    });
  }

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
  }, [themeForm, languageForm]);

  useFocusEffect(
      useCallback(() => {
        checkLogin();

        return () => {
        };
      }, [])
  )

  return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.profile}>
          <TouchableOpacity
              onPress={() => {
                router.push("/auth");
              }}
          >{user ?
              <View style={styles.profileAvatarWrapper}>

                <Image
                    alt="Profile picture"
                    source={require("@/assets/images/blank.png")}
                    style={styles.profileAvatar}
                />
                <Text style={styles.profileName}>root</Text>
              </View> : null}
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <Collapsible iconName="moon" text="Theme">
              <Picker
                  selectedValue={themeForm}
                  onValueChange={(itemValue, itemIndex) => {
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
                  onValueChange={(itemValue, itemIndex) => {
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
            {user ?
                (<TouchableOpacity style={styles.row}  onPress={() => {
                  deleteToken();
                  checkLogin();
                }}>
                  <View style={styles.rowIcon}>
                    <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#000" />
                  </View>
                  <Text style={styles.rowLabel}>
                    Sign out
                  </Text>

                </TouchableOpacity>) : (
                    <TouchableOpacity style={styles.row}  onPress={() => {
                      router.push("/auth");
                    }}>
                      <View style={styles.rowIcon}>
                        <IconSymbol name="person" size={20} color="#000" />
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

