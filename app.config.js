export default {
    expo: {
        name: "plantalert",
        slug: "plantalert",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        userInterfaceStyle: "automatic",
        scheme: "myapp",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            infoPlist: {
                NSLocationWhenInUseUsageDescription: "This app needs WIFI connection info, to make sure you are connected to senzor."
            },
            bundleIdentifier: "com.anonymous.plantalert"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            permissions: [
                "android.permission.ACCESS_WIFI_STATE",
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.ACCESS_WIFI_STATE",
                "android.permission.ACCESS_FINE_LOCATION"
            ],
            package: "com.plantalert.plantalert"
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/splash-icon.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#ffffff"
                }
            ],
            "expo-secure-store"
        ],
        experiments: {
            "typedRoutes": true
        },
        "extra": {
            router: {
                "origin": false
            },
            eas: {
                "projectId": "0d5c1edb-5df2-4f70-8100-6b01a62173f3"
            },
            API_URL: process.env.EXPO_PUBLIC_API_URL,
            NOTIFICATION_ID_FIRST: process.env.EXPO_PUBLIC_NOTIFICATION_ID_FIRST,
            NOTIFICATION_ID_SECOND: process.env.EXPO_PUBLIC_NOTIFICATION_ID_SECOND,
        },
        owner: "chcispat"
    }
};
