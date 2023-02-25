import { createSelector, createSlice } from "@reduxjs/toolkit"

export const newTagInputItem = (options = { name, id }) => {
	return {
		name: options.name,
		id: options.id,
		isSelected: options.isSelected || false,
		...options,
	}
}

const tagInputSlice = createSlice({
	name: "tagInput",
	initialState: {
		items: [],
		count: 0,
	},
	reducers: {
		addItem: (state, action) => {
			const nitem = action.payload

			const id = nitem.id || state.count++

			const exists =
				state.items.filter((item) => {
					if (item.name == nitem.name && item.id == nitem.id) return item
				}).length !== 0
			if (exists == false) {
				state.items.push({ ...nitem, id })
			}
		},
		selectItem: (state, action) => {
			const id = action.payload.id
			const name = action.payload.name
			const items = state.items.reduce((curr, item) => {
				const currItem = newTagInputItem(item)
				if (currItem.name == name && currItem.id == id) {
					item = {
						...currItem,
						isSelected: !currItem.isSelected,
					}
				}
				curr.push(item)
				return curr
			}, [])

			state.items = items
		},
	},
})

export default tagInputSlice.reducer
export const selectTagInput = (state) => state.tagInput
export const selectTagSelected = createSelector(
	[(state) => state.tagInput.items, (state, name) => selectTagByName(state, name)],
	(items, name) => {
		return items.filter((item) => item.isSelected)
	}
)

export const selectTagByName = createSelector(
	[(state) => state.tagInput.items, (state, name) => name],
	(items, name) => {
		return items.filter((item) => item.name == name)
	}
)
export const selectTagByNameSelected = createSelector(
	[(state) => state.tagInput.items, (state, name) => name],
	(items, name) => {
		return items.filter((item) => item.name == name && item.isSelected == true)
	}
)
export const selectTagNotSelected = (state) => {
	const alle = selectTagInput(state)
	return Object.values(alle.items).filter((item) => !item.isSelected)
}
export const { addItem, removeItem, selectItem, updateItem } = tagInputSlice.actions
