/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2c5c36';
const tintColorDark = '#fff';

export type TypeOfColor = {
  text: string,
  background: string,
  subtitle: string,
  tint: string,
  icon: string,
  tabIconDefault: string,
  tabIconSelected: string,
  border: string,
  shadow: string,
}

export const Colors = {
  light: {
    text: '#11181C',
    background: 'rgb(248,244,244)',
    subtitle: '#333',
    tint: tintColorLight,
    icon: '#555555',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    tabs: '#efefef',
    border: '#ddd',
    shadow: '#000',
    card: '#fff',
  },
  dark: {
    text: '#ECEDEE',
    background: '#161819',
    subtitle: '#D3D3D3',
    tint: tintColorDark,
    icon: '#b8b8b8',
    tabs: '#161819',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#162e1b',
    shadow: '#162e1b',
    card: '#191919',
  },
};
