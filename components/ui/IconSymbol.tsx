// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue } from 'react-native';
import {useTheme} from "@/components/ThemeProvider"

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac
  'moon': 'brush',
  'globe': 'language',
  'rectangle.portrait.and.arrow.right': 'cancel',
  'lightbulb': 'light-mode',
  'thermometer': 'device-thermostat',
  'drop': 'water-drop',
  'wifi': 'wifi',
  'plus': 'add',
  'gear': 'settings',
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

import {getColors} from "@/constants/Colors";

let colors = getColors();

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
}: {
  name: IconSymbolName;
  size?: number;
  color?: string | OpaqueColorValue;
  weight?: SymbolWeight;
}) {
  let {theme} = useTheme();

  return <MaterialIcons color={theme.icon} size={size} name={MAPPING[name]} />;
}
