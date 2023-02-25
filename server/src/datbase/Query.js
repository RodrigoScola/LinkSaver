class BaseQueryType {
	type = ""
	key = ""
	value = ""
}

class EqualQueryType extends BaseQueryType {
	type = "eq"
	constructor(key, value) {
		super()
		this.key = key
		this.value = value
	}
}
class LikeQueryType extends BaseQueryType {
	type = "ilike"
	constructor(key, value) {
		super()
		this.key = key
		this.value = value + "%"
	}
}
class SearchQueryType extends BaseQueryType {
	type = "textSearch"
	constructor(key, value) {
		super()
		this.key = key
		this.value = "'" + value + "'"
	}
}
class RangeQueryType extends BaseQueryType {
	type = "range"
	constructor(start = 0, end = 1) {
		super()
		this.key = Math.min(start, end)
		this.value = Math.max(start, end) - 1
	}
}
class QueryType {
	constructor(type) {}
}
class SelectQueryType extends BaseQueryType {
	constructor(type, items = []) {
		this.type = type
		this.key = type
		this.value = items
	}
}
class OrderByQueryType extends BaseQueryType {
	type = "order"
	constructor(column, option = "") {
		super()
		this.key = column
		this.value = { ascending: option.startsWith("asc") }
	}
}

class QueryOption {
	constructor(option) {
		this.option = option
	}
	get type() {
		return this.option.type
	}
	get key() {
		return this.option.key
	}
	get value() {
		return this.option.value
	}
	get options() {
		try {
			return this.option.options
		} catch (err) {
			return null
		}
	}
}
class QueryOptions {
	#_options = []
	constructor(baseQuery, baseOptions = []) {
		this.#_options = []
		this.query = baseQuery
		baseOptions.forEach((option) => {
			this.add(option)
		})
	}
	add(option) {
		this.#_options = [...this.#_options, new QueryOption(option)]
	}
	remove(option) {
		this.#_options = this.#_options.filter((item) => item == new QueryOption(option))
		return this
	}
	get items() {
		return this.#_options
	}
	get options() {
		const op = this.query

		Object.values(this.#_options).forEach((item) => {
			const type = item.option.type
			const key = item.option.key
			const value = item.option.value
			const options = item.option.option

			this.query = this.query[type](key, value, options)
		})
		return this.query
	}
}

module.exports = {
	QueryOptions,
	RangeQueryType,
	OrderByQueryType,
	EqualQueryType,
	SearchQueryType,
	LikeQueryType,
}
