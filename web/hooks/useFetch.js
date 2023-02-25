import _, { toLower } from "lodash"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getData } from "../class/serverBridge"
export const useFetch = (initialUrl, { method = "GET", step = 10, count: initialCount = 0, persists = false } = {}) => {
	const [options, setOptions] = useState({
		step: step,
		initialCount,
	})
	const [url, su] = useState(initialUrl)
	const setUrl = useCallback(
		(ur) => {
			if (ur !== url) {
				su(ur)
			}
		},
		[su, url]
	)

	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState(false)

	const go = useCallback(async () => {
		setIsLoading(true)
		setIsError(false)
		try {
			let ndata
			if (toLower(method) == "delete") {
				ndata = await getData.delete(url)
			} else {
				ndata = await getData.getData(url)
			}
			if (ndata) {
				setData(ndata)
				setIsLoading(false)
				setIsError(false)
				return data
			}
		} catch (err) {
			setIsLoading(false)
			setIsError(true)
			setData(null)
		}
	})

	useEffect(() => {
		if (url !== "") {
			go()
		}
	}, [url])
	return {
		data,
		isLoading,
		isError,
		setUrl,
	}
}
