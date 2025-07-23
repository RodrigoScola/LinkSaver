import { LikeQueryType, RangeQueryType } from "../datbase/Query.js"
import { loopAsync } from "../utils.js"
import { getTable } from "../class/utils.js"
import { SearchColumn } from "./SearchTable.js"
import _ from "lodash"

class Search {
	defaultOptions = {
		tables: ["posts", "folders", "categories", "users"],
		queryOptions: [],
		user_id: null,
	}

	defaultQuery(queryOptions = null) {
		return _.defaults(queryOptions, this.defaultOptions)
	}
	async searchTerm(
		term,
		query = {
			tables: [],
			queryOptions: [],
			user_id: null,
		}
	) {
		query = this.defaultQuery(query)
		const columns = query.tables.map((tableName) => new SearchColumn(tableName))
		let res = await loopAsync(columns, async (column) => {
			let searchObj = [new LikeQueryType(column.searchColumn, term), new RangeQueryType(0, 5)]
			const table = getTable(column.tableName)

			const res = await table.get_posts(searchObj)
			return { [column.tableName]: res }
		})

		let result = {}

		res.map((item) => {
			const type = Object.keys(item)[0]
			const value = item[type]
			result[type] = value
		})

		return result
	}
	async search(
		term,
		query = {
			tables: [],
			queryOptions: [],
			user_id: null,
		}
	) {
		const hasUser = query.queryOptions.reduce(
			(exists, item) => {
				if (item.key == "user_id") {
					exists.exists = true
				} else {
					exists.items.push(item)
				}

				return exists
			},
			{
				exists: false,
				items: [],
			}
		)

		let withoutUser = await this.searchTerm(term, {
			...query,
			queryOptions: hasUser.items,
		})
		if (!hasUser.exists) return withoutUser

		const withUser = await this.searchTerm(term, query)
		let results = Object.entries(withUser).reduce((curr, [key, value]) => {
			curr[key] = _.uniqBy([...value, ...withoutUser[key]], "id")

			return curr
		}, {})
		return results
	}
}
export const searchTable = new Search()
