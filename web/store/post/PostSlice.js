import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { loopAsync } from "../../utils/formatting/utils"
import { getData } from "../../class/serverBridge"
import { newPost } from "../../utils/formatting/utils"
const initalState = {
	posts: {},
}
export const getPosts = createAsyncThunk("posts/getPosts", async (ids) => {
	const ndata = await loopAsync(ids, async (id) => {
		const data = await getData.getData("posts/" + id)
		return data
	})
	return ndata
})
export const getPost = createAsyncThunk("post/getPost", async (id) => {
	const post = await getData.getPost("posts", id)
	return post
})
export const updatePost = createAsyncThunk("post/updatePost", async (postInfo) => {
	const data = await getData.update("posts", postInfo.id, postInfo)

	return data
})
export const postSlice = createSlice({
	name: "post",
	initialState: initalState,
	reducers: {
		addPosts: (state, action) => {
			const posts = action.payload

			posts.forEach((post) => {
				const postId = post.id
				if (postId) {
					state.posts[postId] = post
				}
			})
		},
		addPost: (state, action) => {
			const postId = action.payload.post.id
			if (postId) {
				const post = action.payload.post
				state.posts[postId] = post
			}
		},

		addLike: (state, action) => {
			const { type, id, postId } = action.payload

			state.posts[postId].has_interaction[type] = { type, id }
		},
	},
	extraReducers: {
		[getPost.fulfilled]: (state, action) => {
			const post = newPost(action.payload)

			state.posts[post.id] = post
		},
		[getPosts.fulfilled]: (state, action) => {
			const posts = action.payload

			posts.map((item) => {
				if (item.id) {
					state.posts[item.id] = item
				}
			})
		},

		[updatePost.fulfilled]: (state, action) => {
			const post = newPost(action.payload)
			state.posts[post.id] = post
		},
	},
})

export const selectPosts = (state) => state.post
export const selectPostIds = (state) => state.postIds
export const { addPost, addLike, addPosts } = postSlice.actions
export default postSlice.reducer
