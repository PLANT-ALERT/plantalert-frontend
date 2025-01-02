/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import {getTheme, Theme} from "@/utils/theme"

const tintColorLight = '#2c5c36';
const tintColorDark = '#fff';
let theme = getTheme();

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    subtitle: '#333',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#ddd',
    shadow: '#000'
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    subtitle: '#D3D3D3',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#162e1b',
    shadow: '#162e1b',
  },

};

export const getColors = () => {
  if (theme == Theme.dark) {
    return Colors.dark;
  } else {
    return Colors.light;
  }
}
