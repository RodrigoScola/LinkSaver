import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getData } from "../../class/serverBridge"
import { newFolder } from "../../utils/formatting/utils"

const initalState = {
	posts: {},
}
export const getFolder = createAsyncThunk("folder/getFolder", async (id) => {
	const data = await getData.getPost("folders", id)
	return data
})
export const updateFolder = createAsyncThunk("folder/updateFolder", async (newInfo) => {
	const folder = newFolder(newInfo)
	const data = await getData.update("folders", folder.id, folder)
	console.log(data)
	return data
})
export const folderSlice = createSlice({
	name: "folder",
	initialState: initalState,
	reducers: {
		addFolder: (state, action) => {
			const category_id = action.payload.id
			const category = action.payload

			state.posts[category_id] = category
		},
	},
	extraReducers: {
		[getFolder.fulfilled]: (state, action) => {
			const id = action.payload.id
			if (id) {
				state.posts[id] = action.payload
			}
		},
		[getFolder.pending]: (state, action) => {
			const id = action.payload

			state[id] = newFolder()
		},
		[updateFolder.fulfilled]: (state, action) => {
			const folder = newFolder(action.payload)

			state.posts[folder.id] = action.payload
		},
	},
})

export const selectFolder = (state) => state.folder.posts
export const { addFolder } = folderSlice.actions
export default folderSlice.reducer
