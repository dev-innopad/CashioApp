import { SizeKeys } from '../types/ResponsiveTypes';
import Metrics from './metrics';

// Utility to generate scaled size objects with given scale function and values
function generateScaledSizes(
	values: number[],
	scaleFn: (value: number) => number
): Record<string, number> {
	return values.reduce((acc, value) => {
		acc[`_${value}`] = scaleFn(value);
		return acc;
	}, {} as Record<string, number>);
}

// Generate numbers from 1 to 1000
const sizes = Array.from({ length: 1000 }, (_, i) => i + 1);

// Generate scaled sizes objects
const AppVerticalMargin: Record<SizeKeys, number> = generateScaledSizes(sizes, Metrics.verticalScale);
const AppHorizontalMargin: Record<SizeKeys, number> = generateScaledSizes(sizes, Metrics.horizontalScale);
const AppMargin: Record<SizeKeys, number> = generateScaledSizes(sizes, Metrics.moderateScale);
const AppHeight: Record<SizeKeys, number> = generateScaledSizes(sizes, Metrics.moderateVerticalScale);
const AppWidth: Record<SizeKeys, number> = generateScaledSizes(sizes, Metrics.horizontalScale);

// Padding aliases
const AppVerticalPadding = { ...AppVerticalMargin };
const AppHorizontalPadding = { ...AppHorizontalMargin };
const AppPadding = { ...AppMargin };

export {
	AppHeight,
	AppWidth,
	AppMargin,
	AppPadding,
	AppHorizontalMargin,
	AppHorizontalPadding,
	AppVerticalMargin,
	AppVerticalPadding,
};
