import tinycolor from 'tinycolor2';
import store from '../store';

export interface AppColorTypes {
	background: string;
	backgroundTransparent: string;
	textColor: string;

	segmentBackground: string;

	basicWhite: string;
	basicBlack: string;

	primary10: string;
	primary20: string;
	primary40: string;
	primary60: string;
	primary80: string;
	primary100: string;

	transparentPrimary10: string;
	transparentPrimary20: string;
	transparentPrimary40: string;
	transparentPrimary60: string;
	transparentPrimary80: string;
	transparentPrimary100: string;

	secondary10: string;
	secondary20: string;
	secondary40: string;
	secondary60: string;
	secondary80: string;
	secondary100: string;

	error: string;
	success: string;
	warning: string;
}

// Utility: Generate primary color shades based on lighten percentages
export const generatePrimaryColors = (baseColor: string): Record<string, string> => {
	const lightenLevels = {
		primary10: 45,
		primary20: 35,
		primary40: 20,
		primary60: 10,
		primary80: 5,
		primary100: 0,
	};

	return Object.fromEntries(
		Object.entries(lightenLevels).map(([key, amt]) => [key,
			tinycolor(baseColor).lighten(amt).toRgbString(),
		])
	);
}

// Utility: Generate transparent versions of primary colors
export const generateTransparentPrimaryColors = (baseColor: string): Record<string, string> => {
	const transparencyLevels = {
		transparentPrimary10: 0.1,
		transparentPrimary20: 0.2,
		transparentPrimary40: 0.4,
		transparentPrimary60: 0.6,
		transparentPrimary80: 0.8,
		transparentPrimary100: 1.0,
	};

	return Object.fromEntries(
		Object.entries(transparencyLevels).map(([key, alpha]) => {
			const rgb = tinycolor(baseColor).toRgb();
			return [
				key,
				`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`,
			];
		})
	);
}

// Utility: Generate secondary colors depending on theme mode ('light' or 'dark')
export const generateSecondaryColors = (baseColor: string, mode: 'light' | 'dark'): Record<string, string> => {
	const levels = mode === 'light'
		? // mode === 'light'
		{
			secondary10: 90,
			secondary20: 80,
			secondary40: 60,
			secondary60: 40,
			secondary80: 20,
			secondary100: 0
		} :
		// mode === 'dark'
		{
			secondary10: 0,
			secondary20: 20,
			secondary40: 40,
			secondary60: 60,
			secondary80: 80,
			secondary100: 90
		};

	return Object.fromEntries(
		Object.entries(levels).map(([key, amt]) => [key,
			tinycolor(baseColor).lighten(amt).toRgbString(),
		])
	);
}

const BASIC_COLORS = {
	basicWhite: 'rgba(255, 255, 255, 1)',
	basicBlack: 'rgba(0, 0, 0, 1)',
};

const STATUS_COLORS = {
	error: 'rgba(229, 115, 115, 1)',
	success: 'rgba(92, 184, 92, 1)',
	warning: 'rgba(249, 200, 50, 1)',
};

const BASE_SECONDARY_LIGHT = '#101010ff';
const BASE_SECONDARY_DARK = '#141414ff';

export const generateTheme = (baseColor: string, mode: 'light' | 'dark') => {
	const PRIMARY_COLORS = generatePrimaryColors(baseColor);
	const TRANSPARENT_PRIMARY_COLORS = generateTransparentPrimaryColors(baseColor);
	const SECONDARY_COLORS = generateSecondaryColors(
		mode === 'light' ? BASE_SECONDARY_LIGHT : BASE_SECONDARY_DARK,
		mode
	);

	return {
		background: mode === 'light'
			? 'rgba(255, 255, 255, 1)'
			: 'rgba(0, 0, 0, 1)',

		backgroundTransparent: mode === 'light'
			? 'rgba(255, 255, 255, 0.8)'
			: 'rgba(0, 0, 0, 0.8)',

		textColor: mode === 'light'
			? 'rgba(11, 11, 11, 1)'
			: 'rgba(255, 255, 255, 1)',

		segmentBackground: mode === 'light'
			? 'rgba(230, 230, 230, 1)'
			: 'rgba(35, 35, 35, 1)',

		...BASIC_COLORS,
		...PRIMARY_COLORS,
		...TRANSPARENT_PRIMARY_COLORS,
		...SECONDARY_COLORS,
		...STATUS_COLORS,
	};
}

// Fetch the base colour from redux store fresh every call
const getBaseColour = () => {
	const state = store.getState();
	return state.appData.themeColor;
}

// Export lightTheme and darkTheme as functions to get updated themes dynamically
export const lightTheme = () => {
	const baseColor: any = getBaseColour();
	return generateTheme(baseColor, 'light');
}

export const darkTheme = () => {
	const baseColor: any = getBaseColour();
	return generateTheme(baseColor, 'dark');
}

export const colorOptions = [
	{ id: 1, color: '#5068db' },   // Original Blue (keep)
	{ id: 2, color: '#A6FF00' },   // Acid Green

	//randomly generated colors
	...Array.from({ length: 8 }, (_, i) => ({
		id: i + 3,
		color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`,
	})),

];