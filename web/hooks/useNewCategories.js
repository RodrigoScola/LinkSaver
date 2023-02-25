import { useContext, useEffect, useMemo, useState } from "react"
import { CategoriesContext } from "../context/CategoryContext"
import { toObj } from "../utils/formatting/ObjectFormat"
export const useNewCategories = (initialCatIds = []) => {
	const [ids, setIds] = useState(initialCatIds)

	const { categories: allCategories, getCategories } = useContext(CategoriesContext)

	useEffect(() => {
		if (ids) {
			getCategories(ids)
		}
	}, [ids])

	const addCategories = (nids = []) => {
		setIds(nids)
	}

	const categories = useMemo(() => {
		if (!ids) return {}

		return toObj(
			ids
				.map((id) => {
					if (allCategories[id]) return allCategories[id]
				})
				.filter((item) => item),
			"id"
		)
	}, [ids, allCategories])
	return {
		ids,
		addCategories,
		categories,
	}
}
