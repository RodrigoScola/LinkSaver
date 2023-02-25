import { useFetch } from "./useFetch"
import { useEffect, useMemo } from "react"
import { useState } from "react"
import { obj } from "../utils/formatting/ObjectFormat"
import formatter from "../utils/formatting/formatting"
export const useLoadMore = (url, { step = 5 }) => {
	const { data, isError, isLoading, setUrl } = useFetch(url)
	const [allData, setAllData] = useState([])
	const count = useMemo(() => {
		try {
			if (data.length == 0) return initialCount
			return data.length
		} catch (err) {
			return 0
		}
	}, [data])
	const loadMore = () => {
		const { query, url: base_url } = formatter.url.parseUrl(url)
		const nquery = obj.toQuery({
			...query,
			from: count,
			count: count + step,
		})
		setUrl(`${base_url}/${nquery}`)
	}

	useEffect(() => {
		let ndata = allData
		if (data) {
			ndata = Array.isArray(ndata) ? ndata : [ndata]
			let cur = Array.isArray(data) ? [...data, ...ndata] : ndata
			setAllData(obj.getUniques(cur))
		} else {
			setAllData(ndata)
		}
	}, [data])
	return {
		data,
		isError,
		isLoading,
		setUrl,
		loadMore,
	}
}
