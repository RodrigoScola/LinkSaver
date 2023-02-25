const express = require("express")
const { SearchColumn } = require("../class/SearchTable")
const { RangeQueryType, SearchQueryType, QueryOptions, EqualQueryType, OrderByQueryType } = require("../datbase/Query")
const { getTable } = require("../class/utils")
const queryRouter = express.Router()

queryRouter.use("/", async (req, res, next) => {
	if (!req.query) {
		return next()
	}

	const queryOptions = new QueryOptions({})

	const type = req.baseUrl.replace(/\W/gi, "")
	req.type = type
	const queryparams = new Set(Object.keys(req.query))

	const table = getTable(type)
	let min = 0
	const col = new SearchColumn(type).searchColumn

	if (queryparams.has("s")) {
		const term = req.query["s"]
		queryOptions.add(new SearchQueryType(col, term))
	}
	if (queryparams.has("user_id")) {
		const userId = req.query["user_id"]
		queryOptions.add(new EqualQueryType("user_id", userId))
	}

	if (queryparams.has("select")) {
		const userId = req.query["select"]
		const data = await table.get_all(userId)
		return res.send(data)
	}
	if (queryparams.has("from")) {
		min = Math.max(min, req.query["from"])
	}
	if (queryparams.has("count")) {
		queryOptions.add(new RangeQueryType(min, req.query["count"]))
	} else {
		queryOptions.add(new RangeQueryType(0, 10))
	}
	if (queryparams.has("order")) {
		queryOptions.add(new OrderByQueryType("id", req.query["order"]))
	}

	req.queryOptions = queryOptions.items
	next()
})

module.exports = queryRouter
