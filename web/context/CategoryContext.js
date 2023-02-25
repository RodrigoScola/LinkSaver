import { createContext, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectCategories } from "../store/category/CategorySlice"
import { getCategory as getCat } from "../store/category/CategorySlice"
import { newCategory, loopAsync } from "../utils/formatting/utils"
export const CategoriesContext = createContext({})

export const CategoriesProvider = ({ children }) => {
	const all_categories = useSelector(selectCategories)
	const dispatch = useDispatch()

	const getCategory = (id) => {
		console.log(all_categories[id])
		if (!all_categories[id]) {
			return addCategory(id)
		}
		return newCategory(all_categories[id])
	}

	const getCategories = (ids) => {
		const n = new Set(ids)
		const cats = Promise.all([...n].map((id) => getCategory(id)))
		console.log(cats)
		return cats
	}

	const addCategory = (id) => {
		let data = all_categories[id]
		if (typeof id == "number") {
			if (!data) {
				dispatch(getCat(id))
			}
		}
		return data
	}
	const addCategories = async (ids) => {
		await loopAsync(ids, async (id) => {
			addCategory(id)
		})
	}
	return (
		<CategoriesContext.Provider
			value={{
				categories: all_categories,
				addCategories,
				getCategories,
				getCategory,
			}}
		>
			{children}
		</CategoriesContext.Provider>
	)
}
