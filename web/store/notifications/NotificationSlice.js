import { createSlice } from "@reduxjs/toolkit"
import { store } from "../store"

export const newNotification = (
	options = { id: null, title: "", description: "", duration: 1000, status: "success", isClosable: true }
) => ({
	id: options.id == null ? Date.now().toString() : options.id,
	title: options.title || "",
	duration: options.duration || 5000,
	description: options.description || "",
	status: options.status || "success",
	isClosable: options.isClosable || true,
	...options,
})

export const NotificationSlice = createSlice({
	name: "notifications",
	initialState: {},
	reducers: {
		addNotification: (state, action) => {
			const notification = newNotification(action.payload)
			if (!state[notification.id]) {
				state[notification.id] = notification
			}
		},
		removeNotification: (state, action) => {
			let notification
			if (typeof action.payload == "number" || typeof action.payload == "string") {
				notification = newNotification({ id: action.payload })
			} else {
				notification = newNotification(action.payload)
			}
			delete state[notification.id]
		},
	},
	extraReducers: {},
})

export const selectNotifications = (state) => state.notifications
export const { addNotification, removeNotification } = NotificationSlice.actions

export const createNotification = (
	options = { id: null, title: "", description: "", duration: 1000, status: "success", isClosable: true }
) => {
	store.dispatch(addNotification(newNotification(options)))
}
export const ErrorNotification = () => {
	createNotification({ title: "An Error Has Occurred", status: "error" })
}
export default NotificationSlice.reducer
