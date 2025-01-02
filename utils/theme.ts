export enum Theme {
    light = 'light',
    dark = 'dark',
}

export const getTheme = () : Theme => {
    return Theme.dark;
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