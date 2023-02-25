const express = require("express")
const { getTable } = require("../class/utils")
const { deepSearch } = require("../utils")
const postInfoRouter = express.Router({
	mergeParams: true,
})

function newType(type, value) {
	return {
		type: type,
		value: value,
	}
}

postInfoRouter.param("type", async (req, res, next, type) => {
	const key = deepSearch(req.post, type, (key, obj) => obj[key])

	const post_type = req.post?.type
	const post_id = req.post?.id
	const table = getTable(post_type)
	req.postTable = table
	if (key) {
		req.type = newType(type, key)
		return next()
	} else if (type == "posts" && post_type !== "posts") {
		req.postTable = table
		const data = await table.getPostsById(post_id)
		req.type = newType(type, data)
		return next()
	}

	const err = new Error("key not found")
	err.status = 404

	next(err)
})

postInfoRouter.get("/:type", async (req, res) => {
	res.send(req.type)
})
postInfoRouter.use((err, req, res, next) => {
	const status = err.status || 500
	res.status(status).send(err.message)
})

module.exports = { postInfoRouter }
