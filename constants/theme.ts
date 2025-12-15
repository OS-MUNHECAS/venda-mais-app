/**
 * Sistema de temas do app com suporte a claro, escuro e alto contraste.
 */

import { Platform } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'contrast';

export interface Theme {
  // Cores principais
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  
  // Cores de fundo
  background: string;
  surface: string;
  card: string;
  
  // Cores de texto
  text: string;
  textSecondary: string;
  textDisabled: string;
  
  // Cores de status
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Cores de borda e divisor
  border: string;
  divider: string;
  
  // Cores de ícones
  icon: string;
  iconActive: string;
  
  // Cores de tab
  tabBackground: string;
  tabIconDefault: string;
  tabIconSelected: string;
  
  // Cores de input
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  
  // Cores de botão
  buttonPrimary: string;
  buttonSecondary: string;
  buttonText: string;
  
  // Sombras e elevação
  shadow: string;
  elevation: {
    low: number;
    medium: number;
    high: number;
  };
}

export const LightTheme: Theme = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryLight: '#BBDEFB',
  secondary: '#ff8f00',
  accent: '#4CAF50',
  
  background: '#f5f5f5',
  surface: '#ffffff',
  card: '#ffffff',
  
  text: '#333333',
  textSecondary: '#666666',
  textDisabled: '#999999',
  
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#f44336',
  info: '#2196F3',
  
  border: '#e0e0e0',
  divider: '#eeeeee',
  
  icon: '#687076',
  iconActive: '#2196F3',
  
  tabBackground: '#ffffff',
  tabIconDefault: '#687076',
  tabIconSelected: '#2196F3',
  
  inputBackground: '#f8f8f8',
  inputBorder: '#e0e0e0',
  inputPlaceholder: '#999999',
  
  buttonPrimary: '#2196F3',
  buttonSecondary: '#cccccc',
  buttonText: '#ffffff',
  
  shadow: '#000000',
  elevation: {
    low: 2,
    medium: 4,
    high: 8,
  },
};

export const DarkTheme: Theme = {
  primary: '#90CAF9',
  primaryDark: '#42A5F5',
  primaryLight: '#E3F2FD',
  secondary: '#ffb300',
  accent: '#66BB6A',
  
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2C2C2C',
  
  text: '#ECEDEE',
  textSecondary: '#B0B0B0',
  textDisabled: '#757575',
  
  success: '#66BB6A',
  warning: '#FFD54F',
  error: '#EF5350',
  info: '#42A5F5',
  
  border: '#3D3D3D',
  divider: '#2A2A2A',
  
  icon: '#9BA1A6',
  iconActive: '#90CAF9',
  
  tabBackground: '#1E1E1E',
  tabIconDefault: '#9BA1A6',
  tabIconSelected: '#90CAF9',
  
  inputBackground: '#2C2C2C',
  inputBorder: '#3D3D3D',
  inputPlaceholder: '#757575',
  
  buttonPrimary: '#90CAF9',
  buttonSecondary: '#424242',
  buttonText: '#121212',
  
  shadow: '#000000',
  elevation: {
    low: 2,
    medium: 4,
    high: 8,
  },
};

export const ContrastTheme: Theme = {
  primary: '#0000FF',
  primaryDark: '#000080',
  primaryLight: '#6666FF',
  secondary: '#FF6600',
  accent: '#00FF00',
  
  background: '#000000',
  surface: '#1A1A1A',
  card: '#1A1A1A',
  
  text: '#FFFFFF',
  textSecondary: '#FFFF00',
  textDisabled: '#808080',
  
  success: '#00FF00',
  warning: '#FFFF00',
  error: '#FF0000',
  info: '#00FFFF',
  
  border: '#FFFFFF',
  divider: '#FFFFFF',
  
  icon: '#FFFFFF',
  iconActive: '#FFFF00',
  
  tabBackground: '#000000',
  tabIconDefault: '#FFFFFF',
  tabIconSelected: '#FFFF00',
  
  inputBackground: '#000000',
  inputBorder: '#FFFFFF',
  inputPlaceholder: '#CCCCCC',
  
  buttonPrimary: '#0000FF',
  buttonSecondary: '#FFFFFF',
  buttonText: '#FFFFFF',
  
  shadow: '#FFFFFF',
  elevation: {
    low: 2,
    medium: 4,
    high: 8,
  },
};

export const Themes: Record<ThemeMode, Theme> = {
  light: LightTheme,
  dark: DarkTheme,
  contrast: ContrastTheme,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
