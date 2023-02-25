export class ObjectFormat {
	deepSearch(object, key, predicate = null) {
		if (object.hasOwnProperty(key)) {
			if (predicate !== null) {
				return predicate(key, object)
			}
			return object
		}
		for (let i = 0; i < Object.keys(object).length; i++) {
			let value = object[Object.keys(object)[i]]
			if (typeof value === "object" && value != null) {
				let o = this.deepSearch(object[Object.keys(object)[i]], key, predicate)
				if (o != null) return o
			}
		}
		return null
	}
	getUniques(obj = [], key = null) {
		try {
			if (key == null) {
				const flattened = _.compact(_.flatten(obj))

				if (typeof flattened[0] !== "object") {
					return _.uniq(flattened)
				}
				return _.uniqWith(flattened, _.isEqual)
			}
			let results = []
			obj.forEach((item) => {
				const currRes = this.deepSearch(item, key, (key, obj) => {
					if (typeof obj[key] !== "undefined") return obj[key]
					return item
				})
				if (typeof currRes !== "undefined") {
					results.push(currRes)
				}
			})
			results = _.compact(_.flatten(results))
			if (typeof results[0] !== "object") {
				return _.uniq(_.compact(_.flatten(results)))
			}
			return _.uniqWith(_.compact(_.flatten(results)), _.isEqual)
		} catch (err) {
			console.log(err)
			return []
		}
	}
	toObj(arr = [], key = "id", callback) {
		try {
			const res = {}
			arr.map((item) => {
				const kvalue = item[key]

				res[kvalue] = item
			})
			return res
		} catch (err) {
			console.log(err)
			return {}
		}
	}
	LoopObj(obj, callback) {
		const nObject = Object.values(obj).map((item, index) => {
			const result = callback(item, index, obj)
			return result
		})
		return nObject.filter((item) => item)
	}
	toArr(obj) {
		return Object.values(obj)
	}
	sortBy(arr = [], key) {
		return arr.sort((a, b) => {
			return a[key] - b[key]
		})
	}

	groupBy(key, obj = []) {
		return obj.reduce((total, item) => {
			const val = item[key]

			if (Object.keys(total).includes(val)) {
				total[val] = [...total[val], item]
			} else {
				total[val] = [item]
			}
			return total
		}, {})
	}
	toQuery(obj) {
		const qs =
			"?" +
			Object.keys(obj)
				.map((key) => `${key}=${encodeURIComponent(obj[key])}`)
				.join("&")

		return qs
	}
}

export const obj = new ObjectFormat()

export const { LoopObj, deepSearch, getUniques, groupBy, sortBy, toArr, toObj } = obj
