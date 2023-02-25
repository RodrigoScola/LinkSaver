import { useState } from "react"

export const useErrorMessage = () => {
	const [errors, setErrors] = useState({})

	const add = (type, message) => {
		setErrors((curr) => ({ ...curr, [type]: { type, message } }))
	}
	const remove = (type) => {
		const arr = Object.values(errors).reduce((curr, item) => {
			if (item.type !== type) {
				curr[item.type] = item
			}
			return curr
		}, {})
		setErrors(arr)
	}
	const get = (type) => {
		try {
			return errors[type]
		} catch (err) {
			return {}
		}
	}

	return {
		errors,
		remove,
		add,
		get,
	}
}
