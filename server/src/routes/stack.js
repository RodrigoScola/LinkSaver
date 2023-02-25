const express = require("express")
const { stackHandler } = require("../class/StackExchange")
const { categoryTable } = require("../datbase/CategoryTable")
const { newCategory } = require("../class/records/categoryRecord")
const { loopAsync, deepSearch } = require("../utils")

const stackRouter = express.Router()

stackRouter.use("/:siteName/:id", async (req, res, next) => {
	const tags = await stackHandler.getFromId(req.params.id, req.params.site)

	if (tags) {
		req.post = tags
		const cats = await loopAsync(req.post.tags, async (tag) => {
			const cat = newCategory({ name: tag })
			const id = await categoryTable.addOrRetrieve(
				{
					cat_name: cat.cat_name,
				},
				cat
			)
			return id
		})
		req.post.tags = cats

		return next()
	}
})
stackRouter.get("/:sitename/:id", (req, res) => {
	res.send(req.post)
})

const stackParams = express.Router({ mergeParams: true })

stackRouter.use("/:siteName/:id/", stackParams)

stackRouter.get("/:siteName/:id", (req, res) => {
	res.send(req.post)
})

stackParams.get("/:type", async (req, res) => {
	const param = deepSearch(req.post, req.params.type, (key, value) => value[key])
	if (!param) {
		return res.status(404).send("key not found")
	}
	if (req.params.type == "tags") {
		return res.send(cats)
	}
	return res.send(req.post[req.params.type])

	const data = await stackHandler.getFromId(req.params.id, "stackoverflow")
	res.send([".net", "printing", "javascript", "php", "astrology", "gunbreaker"])
})

stackRouter.use((err, req, res, next) => {
	const status = err.status || 500
	res.status(status).send(err.message)
})
module.exports = stackRouter
