import { useCallback } from "react"
import { useSelector } from "react-redux"

export const useSelect = (selector, input = null) => {
	const cal = useCallback((state) => selector(state, input), [input])

	const items = useSelector((state) => cal(state))
	return items
}