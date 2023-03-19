import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
import { getData } from "../../class/serverBridge"
import { newCategory } from "../../utils/formatting/utils"
const categoryinitialstate = {
	ids: [],
	categories: {},
	isLoading: false,
	hasError: false,
}
export const getCategory = createAsyncThunk("category/getCategory", async (id, store) => {
	const data = await getData.getPost("categories", id)
	return data
})
export const categorySlice = createSlice({
	name: "category",
	initialState: categoryinitialstate,
	reducers: {
		update_category: (state, action) => {
			const cat_id = action.payload.category.id
			const cat = action.payload.category
			state.categories[cat_id] = {
				...cat,
				isSelected: "selected",
			}
		},

		add_category: (state, action) => {
			const category = action.payload.category
			const category_id = category.id
			if (category_id) {
				if (!state.ids.includes(category_id)) {
					state.ids.push(category_id)
					state.categories[category_id] = category
				} else {
					if (JSON.stringify(state.categories[category_id]) !== JSON.stringify(category)) {
						state.categories[category_id] = category
					}
				}
			}
		},
		add_categories: (state, action) => {
			if (action.payload) {
				action.payload.forEach((cat) => {
					const category = newCategory(cat)

					state.categories[category.id] = newCategory(category)
				})
			}
		},
	},
	extraReducers: {
		[getCategory.pending]: (state, action) => {
			state.hasError = true
			state.isLoading = false
		},
		[getCategory.fulfilled]: (state, action) => {
			const category = newCategory(action.payload)
			if (Number(category.id)) {
				state.categories[category.id] = { ...category, state: "loaded" }
				state.ids.push(category.id)
				state.isLoading = false
				state.hasError = false
			}
		},
		[getCategory.rejected]: (state, action) => {
			state.hasError = true
			state.isLoading = false
		},
	},
})

export const selectCategoriesIds = (state) => state.category.ids
export const selectCategories = (state) => state.category.categories
export const selectCategoriesByIds = createSelector([(state) => selectCategories(state), (state, ids) => ids], (state, ids) => {
	if (!ids) return []
	return ids.reduce((categories, id) => {
		if (state[id]) {
			categories.push(state[id])
		}
		return categories
	}, [])
})
export const { add_category, add_categories, update_category } = categorySlice.actions

export default categorySlice.reducer
