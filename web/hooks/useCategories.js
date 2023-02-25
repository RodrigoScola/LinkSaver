import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loopAsync } from "../utils/formatting/utils"
import { getData } from "../class/serverBridge"

import { selectCategories, add_category } from "../store/category/CategorySlice"
export const useCategories = (categoriesIds = []) => {
	const [ids, nids] = useState(categoriesIds)
	const [categories, setCat] = useState({})
	const all_categories = useSelector(selectCategories)

	const dispatch = useDispatch()
	const setCategories = useCallback(
		(categories) => {
			setCat((curr) => ({ ...curr, [categories.id]: { ...categories } }))
		},
		[setCat]
	)
	const setNewIds = useCallback(
		(newValue, options = { strict: false }) => {
			const same = JSON.stringify(ids) === JSON.stringify(newValue)

			if (same == true) return []
			newValue = Array.isArray(newValue) ? newValue : [newValue]
			if (options.strict == false) {
				newValue.forEach((id) => {
					if (ids.indexOf(id) == -1 && (typeof id == "string" || typeof id == "number")) {
						nids((curr) => [...curr, id])
					}
				})
			} else {
				nids(newValue)
			}
		},
		[ids, nids]
	)
	const go = async () => {
		await loopAsync(ids, async (id) => {
			let data = all_categories[id]
			if (!data) {
				data = await getData.getPost("categories", id)
				dispatch(add_category({ category: data }))
			}
			return setCategories(data)
		})
	}

	const ury = (newInfo) => {
		newInfo = {
			...newInfo,
		}
		dispatch(add_category({ category: newInfo }))
		setCategories(newInfo)
		return all_categories[newInfo.id]
	}
	useEffect(() => {
		try {
			go()
		} catch (err) {}
	}, [ids])

	const setNewCats = useCallback(
		(categories) => {
			if (!categories) {
				return null
			}
			const nids = []
			categories.map((category) => {
				nids.push(category.id)
				dispatch(add_category({ category }))
				setCategories(category)
			})
			setNewIds(nids)
		},
		[setNewIds, setCategories, dispatch]
	)
	return {
		categories: Object.values(categories),
		setNewIds,
		ids,
		setCategories: setNewCats,
		updateCategory: ury,
	}
}
