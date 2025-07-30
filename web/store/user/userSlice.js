import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		fetched: false,
		hasError: false,
		loggedIn: false,
		loading: false,
		data: {},
	},
	reducers: {
		addInfo: (state, action) => {
			if (action.payload) {
				Object.keys(action.payload).forEach((item) => {
					state.data[item] = action.payload[item];
				});
			}
		},
	},
});
export const selectUser = (state) => state.user;
export const { addInfo } = userSlice.actions;
export default userSlice.reducer;
