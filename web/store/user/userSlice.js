import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { supabase } from "../../lib/supabaseClient"

export const logout = createAsyncThunk("user/logout", async (id, store) => {
	try {
		const user = store.getState().user.data.id
		const { error } = await supabase.auth.signOut()
		console.log(error)
		return error == null ? true : false
	} catch (err) {}
})

export const userSlice = createSlice({
	name: "user",
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
					state.data[item] = action.payload[item]
				})
			}
		},
	},
	extraReducers: {
		[logout.fulfilled]: (state, action) => {
			state.data = {}
		},
	},
})
export const selectUser = (state) => state.user
export const { addInfo } = userSlice.actions
export default userSlice.reducer
