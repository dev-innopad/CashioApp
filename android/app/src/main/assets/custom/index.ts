import IS_IOS from '../../constants/metrics';
import Metrics from '../../constants/metrics';
import {FontSizeKeys} from '../../types/fontTypes';

type FontSet = {
  THIN: string;
  EXTRA_LIGHT: string;
  LIGHT: string;
  REGULAR: string;
  MEDIUM: string;
  SEMIBOLD: string;
  BOLD: string;
  EXTRA_BOLD: string;
  BLACK: string;
};

// All font sets organized by platform and font family
const Fonts: {
  ios: Record<string, FontSet>;
  android: Record<string, FontSet>;
} = {
  ios: {
    SmoochSans: {
      THIN: 'SmoochSans-Thin',
      EXTRA_LIGHT: 'SmoochSans-ExtraLight',
      LIGHT: 'SmoochSans-Light',
      REGULAR: 'SmoochSans-Regular',
      MEDIUM: 'SmoochSans-Medium',
      SEMIBOLD: 'SmoochSans-SemiBold',
      BOLD: 'SmoochSans-Bold',
      EXTRA_BOLD: 'SmoochSans-ExtraBold',
      BLACK: 'SmoochSans-Black',
    },
  },
  android: {
    SmoochSans: {
      THIN: 'SmoochSans-Thin',
      EXTRA_LIGHT: 'SmoochSans-ExtraLight',
      LIGHT: 'SmoochSans-Light',
      REGULAR: 'SmoochSans-Regular',
      MEDIUM: 'SmoochSans-Medium',
      SEMIBOLD: 'SmoochSans-SemiBold',
      BOLD: 'SmoochSans-Bold',
      EXTRA_BOLD: 'SmoochSans-ExtraBold',
      BLACK: 'SmoochSans-Black',
    },
  },
};

// Select font family per platform
const iosFontFamily = Fonts.ios.SmoochSans;
const androidFontFamily = Fonts.android.SmoochSans;

// Generate font sizes from 1 to 100 dynamically
const fontSizes = Array.from({length: 100}, (_, i) => i + 1);

export const FontSize: Record<FontSizeKeys, number> = fontSizes.reduce(
  (acc, size) => {
    const key = `_${size}` as FontSizeKeys;
    acc[key] = Metrics.moderateScale(size);
    return acc;
  },
  {} as Record<FontSizeKeys, number>,
);

// Export the selected fonts based on platform
export const AppFonts = IS_IOS ? iosFontFamily : androidFontFamily;
