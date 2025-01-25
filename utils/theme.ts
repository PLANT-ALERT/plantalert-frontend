import {getData} from "@/hooks/setStorageData";

export enum Theme {
    light = 'light',
    dark = 'dark',
}

export const getTheme = () : Theme => {
    getData({storeKey: "theme"}).then(data => {
        if (data == "dark") {
            return Theme.dark;
        }
    })
    return Theme.light;
}

export const setTheme = (theme : Theme) => {

}

export const isDarkMode = () : boolean => {
    return getTheme() === Theme.dark;
}

export const getColorReverseIcon = () => {
    if (getTheme() == Theme.dark) {
        return "white"
    } else {
        return "black"
    }
}