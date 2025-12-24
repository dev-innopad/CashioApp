import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { colorOptions } from '../../theme/AppColors';

interface appDataState {
	isLogin?: boolean;
	localize?: string; // en, jp, es
	themeId: number;   // 1 - System, 2 - Light, 3 - Dark
	iconId: number;    // 1 default
	themeColorId?: number;  // id of selected anime color
	themeColor?: string;    // hex color code of selected anime color
}

const initialState: appDataState = {
	isLogin: false,
	localize: 'en',
	themeId: 1,
	iconId: 1,
	themeColorId: 1,
	themeColor: colorOptions[0].color,
};

const appDataSlice = createSlice({
	name: 'appData',
	initialState,
	reducers: {
		setIsLogin: (state, action: PayloadAction<boolean>) => {
			state.isLogin = action.payload;
		},

		setLocalize: (state, action: PayloadAction<string>) => {
			state.localize = action.payload;
		},

		setThemeId: (state, action: PayloadAction<number>) => {
			state.themeId = action.payload;
		},

		setIconId: (state, action: PayloadAction<number>) => {
			state.iconId = action.payload;
		},

		setThemeColorId: (state, action: PayloadAction<number>) => {
			state.themeColorId = action.payload;
		},

		setThemeColor: (state, action: PayloadAction<string>) => {
			state.themeColor = action.payload;
		},
	},
});

export const {
	setIsLogin,
	setLocalize,
	setThemeId,
	setIconId,
	setThemeColorId,
	setThemeColor,
} = appDataSlice.actions;

export default appDataSlice.reducer;
