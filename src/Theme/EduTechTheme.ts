// theme.js
import {MD3LightTheme as DefaultTheme} from 'react-native-paper';

export const EduTechTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4F46E5', // Indigo
    onPrimary: '#FFFFFF',
    secondary: '#00F5D4', // Neon Teal
    onSecondary: '#000000',
    background: '#F5F7FA', // Light Gray
    surface: '#FFFFFF',
    onSurface: '#1F2937', // Dark Text
    text: '#1F2937',
    error: '#EF4444', // Coral Red
    onError: '#FFFFFF',
    outline: '#6B7280', // Muted Gray for borders
  },
  roundness: 12,
  fonts: {
    ...DefaultTheme.fonts,
  },
};
