import React, { useEffect, useMemo } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { default as CustomSlider } from '../../../components/AppCircleSlider';
import { AppHorizontalMargin } from '../../../constants/responsive';
import { AppDispatch } from '../../../store';
import { AppColorTypes } from '../../../theme/AppColors';
import { useTheme } from '../../../theme/ThemeProvider';

declare function alert(message: string): void;

interface AppSlideShowProps {
	navigation: any
}

const AppSlideShow = (props: AppSlideShowProps) => {

	const dispatch: AppDispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
		const unsubscribe = props.navigation.addListener('focus', () => {
		});

		return () => {
			backHandler.remove();
			unsubscribe();
		}
	}, [dispatch, props.navigation]);

	const dummyData = [
		{ id: '0', title: 'Item 1', image: 'https://cdn.pixabay.com/photo/2022/12/16/16/28/drinking-cups-7660115_1280.jpg' },
		{ id: '1', title: 'Item 2', image: 'https://cdn.pixabay.com/photo/2025/07/12/16/34/umbrella-9710962_1280.jpg' },
		{ id: '2', title: 'Item 3', image: 'https://cdn.pixabay.com/photo/2025/04/30/13/05/cat-9569386_1280.jpg' },
		{ id: '3', title: 'Item 4', image: 'https://cdn.pixabay.com/photo/2025/06/05/16/39/desert-9643279_1280.jpg' },
		{ id: '4', title: 'Item 5', image: 'https://cdn.pixabay.com/photo/2021/10/07/00/48/boat-6686952_1280.jpg' },
		{ id: '5', title: 'Item 6', image: 'https://cdn.pixabay.com/photo/2024/11/30/15/55/eiffel-tower-9235220_1280.jpg' },
		{ id: '6', title: 'Item 7', image: 'https://cdn.pixabay.com/photo/2025/01/20/20/11/shrine-9348003_960_720.jpg' },
		{ id: '7', title: 'Item 8', image: 'https://cdn.pixabay.com/photo/2023/02/10/16/07/new-york-7781184_1280.jpg' },
		{ id: '8', title: 'Item 9', image: 'https://cdn.pixabay.com/photo/2014/11/14/08/23/japan-530348_1280.jpg' },
		{ id: '9', title: 'Item 10', image: 'https://cdn.pixabay.com/photo/2024/06/07/05/44/ai-generated-8813940_960_720.jpg' },
	];

	return (
		<CustomSlider
			data={dummyData}
		/>
	);
};

const createStyles = (AppColors: AppColorTypes) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			marginHorizontal: AppHorizontalMargin._20,
		}
	});
};

export default AppSlideShow;