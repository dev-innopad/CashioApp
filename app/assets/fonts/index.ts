import IS_IOS from '../../constants/metrics';
import Metrics from '../../constants/metrics';
import { FontSizeKeys } from '../../types/fontTypes';

type FontSet = {
	REGULAR: string;
	MEDIUM: string;
	BOLD: string;
};

// All font sets organized by platform and font family
const Fonts: {
	ios: Record<string, FontSet>;
	android: Record<string, FontSet>
} = {
	//iOS fonts
	ios: {
		Montserrat: {
			REGULAR: 'Montserrat-Regular',
			MEDIUM: 'Montserrat-SemiBold',
			BOLD: 'Montserrat-Bold',
		}
	},

	//android fonts
	android: {
		Montserrat: {
			REGULAR: 'Montserrat-Regular',
			MEDIUM: 'Montserrat-SemiBold',
			BOLD: 'Montserrat-Bold',
		}
	},

};

// Select your preferred font family per platform here
const iosFontFamily = Fonts.ios.Montserrat;
const androidFontFamily = Fonts.android.Montserrat;

// Generate font sizes from 1 to 100 dynamically
const fontSizes = Array.from({ length: 100 }, (_, i) => i + 1);

export const FontSize: Record<FontSizeKeys, number> = fontSizes.reduce((acc, size) => {
	const key = `_${size}` as FontSizeKeys; // <-- tell TypeScript this is safe
	acc[key] = Metrics.moderateScale(size);
	return acc;
}, {} as Record<FontSizeKeys, number>);

// Export the selected fonts based on platform and family
export const AppFonts = IS_IOS
	? iosFontFamily
	: androidFontFamily;