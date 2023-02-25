import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getData } from "../../class/serverBridge"
import { newCategory, newFolder, newItem, newPost } from "../../utils/formatting/utils"
import { createNotification } from "../notifications/NotificationSlice"

export const getPostStackInformation = createAsyncThunk("newPost/getPostStackInformation", async (url) => {
	const data = await getData.getData(url)

	return data
})
export const submitPost = createAsyncThunk("newPost/submitPost", async (dispatch, getState) => {
	const post = newPost(getState.getState().newPost.post)

	const data = await getData.post("posts", post)
	console.log(post)

	if (post.folder !== null) {
		const folderdata = await getData.post("folders/" + post.folder, {
			post_id: data.id,

			type: "posts",
		})
	}
	createNotification({
		title: "new Post added",
	})
	return data
})

export const submitFolder = createAsyncThunk("newPost/submitFolder", async (dispatch, getState) => {
	const post = newFolder(getState.getState().newPost.folder)
	console.log(getState.getState().newPost.folder)
	const parent_folder = post.parent_folder.id
	const data = await getData.post("folders", { ...post, parent_folder })
	createNotification({
		title: "new folder created",
		description: "you created a new folder",
	})
	return data
})

export const submitCategory = createAsyncThunk("newPost/submitCategory", async (dispatch, getState) => {
	const post = newCategory(getState.getState().newPost.category)
	const data = await getData.post("categories", post)

	return data
})

const setData = (state, { isLoading = true, hasError = false, data = null }) => {
	return { ...state, isLoading, hasError, data }
}

const fetchOptions = {
	isLoading: true,
	data: null,

	hasError: false,
}
const newPostSlice = createSlice({
	name: "newPost",
	initialState: {
		post: {
			...newPost(),
			...fetchOptions,
		},
		category: { ...newCategory(), ...fetchOptions },
		folder: { ...newFolder(), ...fetchOptions },
	},
	reducers: {
		updateData: (state, action) => {
			const type = action.payload.type || "post"
			console.log(action.payload)
			const post = newItem(type, {
				...state[type],
				...action.payload,
			})
			if (state[type]) {
				state[type] = {
					...state[type],
					...post,
				}
			} else {
				state[type] = newItem(type, post)
			}
		},
	},
	extraReducers: {
		[getPostStackInformation.pending]: (state, action) => {
			state.isLoading = true
			state.hasError = false
		},
		[getPostStackInformation.rejected]: (state, action) => {
			state.isLoading = false
			state.hasError = true
		},
		[getPostStackInformation.fulfilled]: (state, action) => {
			state.categories = action.payload
		},
		[submitFolder.pending]: (state, action) => {
			state.folder = setData(state.folder, { isLoading: true, hasError: false })
		},
		[submitFolder.rejected]: (state, action) => {
			state.folder = setData(state.folder, { isLoading: false, hasError: true })
		},
		[submitFolder.fulfilled]: (state, action) => {
			state.folder = setData(state.folder, { data: action.payload, hasError: false, isLoading: false })
		},
		[submitCategory.pending]: (state, action) => {
			state.category = setData(state.category, { isLoading: true })
		},
		[submitCategory.rejected]: (state, action) => {
			state.category = setData(state.category, { hasError: false, isLoading: false })
		},
		[submitCategory.fulfilled]: (state, action) => {
			state.category = setData(state.category, { data: action.payload, hasError: false, isLoading: false })
		},
	},
})

export const selectNewPost = (state) => state.newPost.post
export const selectNewCategory = (state) => state.newPost.category
export const selectNewFolder = (state) => state.newPost.folder

export const { updateData } = newPostSlice.actions
export default newPostSlice.reducer
