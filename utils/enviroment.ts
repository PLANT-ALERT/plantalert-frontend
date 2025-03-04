function getEnvVariable(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export let API_URL = getEnvVariable("EXPO_PUBLIC_API_URL");
export let NOTIFICATION_ID_FIRST = getEnvVariable("EXPO_PUBLIC_NOTIFICATION_ID_FIRST");
export let NOTIFICATION_ID_SECOND = getEnvVariable("EXPO_PUBLIC_NOTIFICATION_ID_SECOND");