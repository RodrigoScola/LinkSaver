import { configureStore } from "@reduxjs/toolkit"
import CategorySlice from "./category/CategorySlice"
import folderSlice from "./folder/FolderSlice"
import InteractionsSlice from "./interactions/InteractionsSlice"
import newPostSlice from "./newPost/newPostSlice"
import PostSlice from "./post/PostSlice"
import currentStackPostSlice from "./stackData/StackDataSlice"
import TagInputSlice from "../Components/inputs/TagInput/TagInputSlice"
import SearchSlice from "./search/SearchSlice"
import userSlice from "./user/userSlice"
import NotificationSlice from "./notifications/NotificationSlice"
export const store = configureStore({
	reducer: {
		tagInput: TagInputSlice,
		search: SearchSlice,
		newPost: newPostSlice,
		interactions: InteractionsSlice,
		category: CategorySlice,
		folder: folderSlice,
		post: PostSlice,
		currentStackPost: currentStackPostSlice,
		user: userSlice,
		notifications: NotificationSlice,
	},
})
