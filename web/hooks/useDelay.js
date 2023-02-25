import { useCallback, useState, useMemo } from "react"
export const useDelay = (callback, time = 100) => {
	const [isAvailable, setAvailable] = useState(true)
	const n = useMemo(() => {
		let timer1 = setTimeout(() => {
			if (isAvailable == false) {
				setAvailable(true)
			}
		}, time)

		return () => {
			clearTimeout(timer1)
		}
	})

	const setNewFolderColor = useCallback(
		(e) => {
			if (isAvailable == true) {
				callback(e)
			}
			setAvailable(false)
		},
		[callback, isAvailable]
	)
	return {
		isAvailable,
		fn: setNewFolderColor,
	}
}
