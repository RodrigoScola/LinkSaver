import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../class/serverBridge"

const initalState = {
	hasError: false,
	isLoading: true,
	data: {
		tags: [],
	},
}
export const getStackPostData = createAsyncThunk("currentStackPost/getStackPostData", async (id) => {
	const data = await axios.get("posts")
	return data.data
})

export const currentStackPostSlice = createSlice({
	name: "currentStackPost",
	initialState: initalState,
	reducers: {},
	extraReducers: {
		[getStackPostData.pending]: (state, action) => {
			state.hasError = false
			state.isLoading = true
		},
		[getStackPostData.rejected]: (state, action) => {
			state.hasError = true
			state.isLoading = false
		},
		[getStackPostData.fulfilled]: (state, action) => {
			state.hasError = false
			state.isLoading = true
			state.data = action.payload
		},
	},
})
export const selectStackData = (state) => state.currentStackPost.data
export const selectStackPost = (state) => state.currentStackPost

export default currentStackPostSlice.reducer
