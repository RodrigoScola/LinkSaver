import { createSlice } from "@reduxjs/toolkit"

const InteractionsSlice = createSlice({
	name: "interactions",
	initialState: {
		interactions: {},
	},
	reducers: {
		addPostInteraction: (state, action) => {
			state.interactions[action.payload.id] = {}
		},
		addInteraction: (state, action) => {
			state.interactions[action.payload.post_id] = {
				...state.interactions[action.payload.post_id],
				[action.payload.type]: action.payload,
			}
		},
	},
})
export const { addInteraction, addPostInteraction } = InteractionsSlice.actions
export default InteractionsSlice.reducer
