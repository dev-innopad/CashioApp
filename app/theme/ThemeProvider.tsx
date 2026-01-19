import React, {ReactNode, createContext, useContext, useMemo} from 'react';
import {StatusBar, StatusBarStyle, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../store';
import {setThemeId} from '../store/reducers/appData.slice'; // Updated action
import {darkTheme, generateTheme, lightTheme, AppColorTypes} from './AppColors';

// Define theme IDs
export const THEME_ID_SYSTEM = 1; // System Default
export const THEME_ID_LIGHT = 2; // Light Mode
export const THEME_ID_DARK = 3; // Dark Mode

interface ThemeContextProps {
  themeId: number | any; // Current theme ID
  AppColors: AppColorTypes; // Current theme colors
  toggleTheme: () => void; // Toggle between light/dark themes
  setThemeId: (id: number) => void; // Set theme by ID
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  isDisabled?: boolean; // Disable theme changes (optional)
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  isDisabled = false,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const systemColorScheme = useColorScheme(); // Get system color scheme (light/dark)
  const themeId = useSelector((state: any) => state.appData.themeId); // Get current theme ID from Redux
  const themeColor = useSelector((state: any) => state.appData.themeColor);

  // Determine the current theme colors based on themeId and system settings
  const AppColors = useMemo(() => {
    if (isDisabled) return generateTheme(themeColor, 'light');

    switch (themeId) {
      case THEME_ID_SYSTEM:
        return generateTheme(
          themeColor,
          systemColorScheme === 'dark' ? 'dark' : 'light',
        );
      case THEME_ID_LIGHT:
        return generateTheme(themeColor, 'light');
      case THEME_ID_DARK:
        return generateTheme(themeColor, 'dark');
      default:
        return generateTheme(themeColor, 'light');
    }
  }, [themeId, themeColor, systemColorScheme, isDisabled]);

  // Determine the StatusBar style based on the current theme
  const barStyleCondition = useMemo<StatusBarStyle>(() => {
    if (isDisabled) return 'light-content'; // If disabled, use light content

    const effectiveTheme =
      themeId === THEME_ID_SYSTEM
        ? systemColorScheme // Use system theme
        : themeId === THEME_ID_LIGHT
        ? 'light'
        : 'dark'; // Use light/dark theme

    return effectiveTheme === 'dark' ? 'light-content' : 'dark-content';
  }, [themeId, systemColorScheme, isDisabled]);

  // Toggle between light and dark themes (ignores system theme)
  const toggleTheme = () => {
    const newThemeId =
      themeId === THEME_ID_LIGHT ? THEME_ID_DARK : THEME_ID_LIGHT;
    dispatch(setThemeId(newThemeId));
  };

  // Set theme by ID (1, 2, or 3)
  const handleSetThemeId = (id: number) => {
    dispatch(setThemeId(id));
  };

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        AppColors,
        toggleTheme,
        setThemeId: handleSetThemeId,
      }}>
      <StatusBar barStyle={barStyleCondition} />
      {children}
    </ThemeContext.Provider>
  );
};
