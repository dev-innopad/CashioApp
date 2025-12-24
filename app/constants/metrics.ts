import { Dimensions, PixelRatio, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

console.log(DeviceInfo.getModel());

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

const windowSize = Dimensions.get('window');
const IS_TABLET = DeviceInfo.isTablet();
const IS_IPHONEX = DeviceInfo.getModel().includes('iPhone X') || DeviceInfo.getModel().includes('iPhone 11');
const HAS_NOTCH = DeviceInfo.hasNotch();
const ANDROID_STATUSBAR = 24;

const DEVICE_HEIGHT =
	windowSize.height > windowSize.width
		? IS_ANDROID
			? windowSize.height - ANDROID_STATUSBAR
			: windowSize.height
		: IS_ANDROID
			? windowSize.width - ANDROID_STATUSBAR
			: windowSize.width;

const DEVICE_WIDTH = windowSize.height
	> windowSize.width
	? windowSize.width
	: windowSize.height;

// //console.log('IS_ANDROID', IS_ANDROID);
console.log('DEVICE_HEIGHT ', windowSize.height);
console.log('DEVICE_WIDTH ', windowSize.width);

const IS_IPHONE4_OR_5 = DEVICE_WIDTH === 320;
const IS_SMALL_ANDROID = IS_ANDROID && windowSize.height < 600;

const HEADER_HEIGHT = IS_IOS ? (IS_IPHONEX ? 55 : 64) : 50; //TODO: get the correct height for android

const TILE_MIN_WIDTH = DEVICE_WIDTH * 0.28;
const TILE_MARGIN = DEVICE_WIDTH * 0.1;
const TILE_BORDER_RADIUS = 22;

const DESIGN_WIDTH = IS_TABLET ? 834 : 375;
const DESIGN_HEIGHT = IS_TABLET ? 1194 : 667;

const DESIGN_WIDTH_X = 375;
const DESIGN_HEIGHT_X = 812;

const BOARD_HEIGHT = DEVICE_HEIGHT * 0.78;
const BOARD_WIDTH = DEVICE_WIDTH;
const BOARD_LEFT = -DEVICE_WIDTH * 0.5;

const TRIANGLE_HEIGHT = DEVICE_HEIGHT * 0.022;
const TIME_BAR_HEIGHT = DEVICE_HEIGHT * 0.015;

const widthN = (num: number) => PixelRatio.roundToNearestPixel((DEVICE_WIDTH / DESIGN_WIDTH) * num);
const heightN = (num: number) => PixelRatio.roundToNearestPixel((DEVICE_HEIGHT / DESIGN_HEIGHT) * num);

const widthX = (num: number) => PixelRatio.roundToNearestPixel((DEVICE_WIDTH / DESIGN_WIDTH_X) * num);
const heightX = (num: number) => PixelRatio.roundToNearestPixel((DEVICE_HEIGHT / DESIGN_HEIGHT_X) * num);

const width = (num: number) => (IS_IPHONEX ? widthX(num) : widthN(num));
const height = (num: any) => (IS_IPHONEX ? heightX(num) : heightN(num));

const AVATAR_SLIDER_ITEM_WIDTH = IS_TABLET ? width(400) : width(225);

const scaledFontSize = (fontSize: number) => Math.round((fontSize * DEVICE_WIDTH) / DESIGN_WIDTH);

const HIT_SLOP = IS_TABLET ? 50 : 15;

const HIT_SLOP_PROP = {
	top: HIT_SLOP,
	bottom: HIT_SLOP,
	left: HIT_SLOP,
	right: HIT_SLOP,
};

const fontSizes = {
	small: 14,
	medium: 18,
	large: 24,
	h1: IS_TABLET ? 26 : 22,
};

export const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
export const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export function getNewSize(size: number): number {
	const aspectRatio = windowHeight / windowWidth;
	if (aspectRatio > 1.77) {
		return size;
	} else if (aspectRatio > 1.6) {
		return size * 0.97;
	} else if (aspectRatio > 1.55) {
		return size * 0.95;
	} else if (aspectRatio > 1.5) {
		return size * 0.93;
	} else if (aspectRatio > 1.45) {
		return size * 0.91;
	} else if (aspectRatio > 1.4) {
		return size * 0.89;
	} else if (aspectRatio > 1.35) {
		return size * 0.87;
	} else if (aspectRatio > 1.3) {
		return size * 0.85;
	} else if (aspectRatio > 1.2) {
		return size * 0.84;
	} else {
		return size * 0.6;
	}
}

const isLessWidth = windowWidth < windowHeight;
const shortDimension = isLessWidth ? windowWidth : windowHeight;
const longDimension = isLessWidth ? windowHeight : windowWidth;

function horizontalScale(size: number, skipAspectRatio: boolean = false): number {
	const changeSize = skipAspectRatio ? size : getNewSize(size);
	return (shortDimension / guidelineBaseWidth) * changeSize;
}
function verticalScale(size: number, skipAspectRatio: boolean = false): number {
	const changeSize = skipAspectRatio ? size : getNewSize(size);
	return (longDimension / guidelineBaseHeight) * changeSize;
}
function moderateScale(size: number, skipAspectRatio: boolean = false, factor: number = 0.5): number {
	const changeSize = skipAspectRatio ? size : getNewSize(size);
	return changeSize + (horizontalScale(changeSize, skipAspectRatio) - changeSize) * factor;
}
function moderateVerticalScale(size: number, skipAspectRatio: boolean = false, factor: number = 0.5): number {
	const changeSize = skipAspectRatio ? size : getNewSize(size);
	return changeSize + (verticalScale(changeSize, skipAspectRatio) - changeSize) * factor;
}

// Used via Metrics.baseMargin
const Metrics = {
	zero: 0,
	baseMargin: 10,
	doubleBaseMargin: 20,
	smallMargin: 5,
	textFieldRadius: 6,
	borderLineWidth: 1,
	screenWidth: screenWidth < screenHeight ? screenWidth : screenHeight,
	screenHeight: screenWidth < screenHeight ? screenHeight : screenWidth,
	navBarHeight: Platform.OS === 'ios' ? verticalScale(64) : verticalScale(54),
	scanerPreviewHeight: verticalScale(400),
	buttonRadius: 4,
	icons: {
		tiny: 16,
		small: 20,
		medium: 30,
		large: 45,
		xl: 50,
	},
	images: {
		small: 20,
		medium: 40,
		large: 60,
		logo: 200,
	},
	headerShadow: {
		shadowColor: 'grey',
		shadowOffset: { width: 1, height: 2.5 },
		shadowOpacity: 0.2,
		shadowRadius: 1,
		elevation: 2,
	},
	size: {
		s: 5,
		m: 10,
		l: 15,
		xl: 20,
		xxl: 25,
		xxxl: 30,
	},
};

export default {
	DESIGN_WIDTH,
	DESIGN_HEIGHT,
	DESIGN_WIDTH_X,
	DEVICE_HEIGHT,
	DEVICE_WIDTH,
	HEADER_HEIGHT,
	TIME_BAR_HEIGHT,
	TILE_MIN_WIDTH,
	TILE_MARGIN,
	TILE_BORDER_RADIUS,
	BOARD_LEFT,
	BOARD_HEIGHT,
	BOARD_WIDTH,
	TRIANGLE_HEIGHT,
	HIT_SLOP,
	HIT_SLOP_PROP,
	width,
	height,
	widthX,
	heightX,
	fontSizes,
	IS_IPHONEX,
	IS_TABLET,
	IS_IPHONE4_OR_5,
	IS_SMALL_ANDROID,
	IS_ANDROID,
	IS_IOS,
	HAS_NOTCH,
	AVATAR_SLIDER_ITEM_WIDTH,
	scaledFontSize,
	verticalScale,
	moderateScale,
	Metrics,
	horizontalScale,
	moderateVerticalScale,
};