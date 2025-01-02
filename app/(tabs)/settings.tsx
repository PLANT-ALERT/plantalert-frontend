import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Switch,
    Image,
} from 'react-native';

import {getColors} from "@/constants/Colors";

import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { User } from "@/types/user"
import {setTheme, Theme, isDarkMode, getColorReverseIcon} from "@/utils/theme";

let colors = getColors();

export default function Settings() {
    const [user, setUser] = useState<User>({
        name: "tonda",
        home: {
            name: "jirka mit domov",
            latitude: "55",
            longitude: "55",
        },
    });
    const [form, setForm] = useState({
        darkMode: isDarkMode(),
        emailNotifications: true,
        pushNotifications: false,
    });

    useEffect(() => {
        if (form.darkMode) {
            setTheme(Theme.dark);
        } else {
            setTheme(Theme.light);
        }
    }, [form])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.profile}>
                <TouchableOpacity
                    onPress={() => {
                        // handle onPress
                    }}>
                    <View style={styles.profileAvatarWrapper}>
                        {user?.image ? (<Image
                            alt="Profile picture"
                            source={{uri: user.image}}
                            style={styles.profileAvatar} />) : (  <Image
                            alt="Profile picture"
                            source={require("@/assets/images/blank.png")}
                            style={styles.profileAvatar} />)}

                        <Text style={styles.profileName} >
                            {user?.name}
                        </Text>
                        <Text style={styles.profileAddress} >
                            {user?.home.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <TouchableOpacity
                        onPress={() => {

                        }}
                        style={styles.row}>
                        <View style={styles.rowIcon}>
                            <Entypo name="language" size={24} color={getColorReverseIcon()} />
                        </View>

                        <Text style={styles.rowLabel}>Language</Text>

                        <View style={styles.rowSpacer} />

                    </TouchableOpacity>

                    <View style={styles.row}>
                        <View style={styles.rowIcon}>
                            <MaterialIcons name="dark-mode" size={24} color={getColorReverseIcon()}  />
                        </View>

                        <Text style={styles.rowLabel}>Dark Mode</Text>

                        <View style={styles.rowSpacer} />

                        <Switch
                            onValueChange={darkMode => setForm({ ...form, darkMode })}
                            value={form.darkMode} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    /** Profile */
    profile: {
        padding: 24,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileAvatarWrapper: {
        position: 'relative',
        alignItems: 'center',
    },
    profileAvatar: {
        width: 72,
        height: 72,
        borderRadius: 9999,
    },
    profileAction: {
        position: 'absolute',
        right: -4,
        bottom: -10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 9999,
        backgroundColor: '#007bff',
    },
    profileName: {
        marginTop: 20,
        fontSize: 19,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'center',
    },
    profileAddress: {
        marginTop: 5,
        fontSize: 16,
        color: colors.subtitle,
        textAlign: 'center',
    },
    /** Section */
    section: {
        paddingHorizontal: 24,
    },
    sectionTitle: {
        paddingVertical: 12,
        fontSize: 12,
        fontWeight: '600',
        color: '#9e9e9e',
        textTransform: 'uppercase',
        letterSpacing: 1.1,
    },
    /** Row */
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: {
        fontSize: 17,
        fontWeight: '400',
        color: colors.text,
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
});