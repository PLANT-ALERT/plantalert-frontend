import AsyncStorage from '@react-native-async-storage/async-storage';


export const storeData = async ({storeKey, value} : {storeKey: string, value: string}) => {
    try {
        await AsyncStorage.setItem(storeKey, value)
    } catch (e) {
        // saving error
    }
}


export const getData = async ({storeKey} : {storeKey : string}) => {
    try {
        const value = await AsyncStorage.getItem(storeKey)
        if(value !== null) {
            return value;
        }
        return null;
    } catch(e) {
        return null;
    }
}
