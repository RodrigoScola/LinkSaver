import { createSlice } from "@reduxjs/toolkit"

const SearchTermSlice = createSlice({
	name: "search",
	initialState: {},
	reducers: {
		addSearchInput: (state, action) => {
			state[action.payload] = newTerm()
		},
		updateSearchData: (state, action) => {
			const name = action.payload.name
			state[name] = newTerm({
				...state[name],
				...action.payload,
				results: state[name].results,
			})
		},
		clearResults: (state, action) => {
			const name = action.payload.name
			state[name] = newTerm({ term: "", results: [], url: "" })
		},
		updateSearchResults: (state, action) => {
			const results = action.payload.results

			const name = action.payload.name
			if (results) {
				state[name].results = results
			}
		},
	},
})

export default SearchTermSlice.reducer

export const selectSearch = (state) => {
	return state.search
}

const newTerm = (options = { term: "", results: [], url: "" }) => {
	return {
		term: options.term,
		results: options.results,
		url: options.url,
	}
}

export const { addSearchInput, clearResults, updateSearchData, updateSearchResults } = SearchTermSlice.actions
