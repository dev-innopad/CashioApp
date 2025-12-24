import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserDataState {
	items?: any[];
	userName?: string;
}

const initialState: UserDataState = {
	items: [],
	userName: 'Onyx!',
};

const homeScreenSlice = createSlice({
	name: 'userData',
	initialState,
	reducers: {
		setData: (state, action: PayloadAction<any[]>) => {
			state.items = action.payload;
		},

		setUserName: (state, action: PayloadAction<string>) => {
			state.userName = action.payload;
		},
	},
});

export const {
	setData,
	setUserName
} = homeScreenSlice.actions;

export default homeScreenSlice.reducer;
