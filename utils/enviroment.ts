import Constants from "expo-constants";

export const API_URL = Constants.expoConfig?.extra?.API_URL;
export const NOTIFICATION_ID_FIRST = Constants.expoConfig?.extra?.NOTIFICATION_ID_FIRST;
export const NOTIFICATION_ID_SECOND = Constants.expoConfig?.extra?.NOTIFICATION_ID_SECOND;

if (!API_URL) console.warn("⚠️ Missing API_URL in Constants.extra");
if (!NOTIFICATION_ID_FIRST) console.warn("⚠️ Missing NOTIFICATION_ID_FIRST in Constants.extra");
if (!NOTIFICATION_ID_SECOND) console.warn("⚠️ Missing NOTIFICATION_ID_SECOND in Constants.extra");
