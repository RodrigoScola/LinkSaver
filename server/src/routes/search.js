import express from 'express'
import { searchTable }  from "../class/Search.js"

const searchRouter = express.Router()

searchRouter.use((req, res, next) => {
	const searchTerm = req.queryOptions.filter((item) => item.type == "textSearch")[0].value.replace(/[']/gi, "")

	req.searchTerm = searchTerm

	if (searchTerm == "") {
		const err = new Error("invalid search term")
		return next(err)
	}
	return next()
})

searchRouter.get(["/categories", "/folders", "/posts", "/users", "/all"], async (req, res, next) => {
	const type = req.url.split(/\W/)[1]

	const results = await searchTable.search(req.searchTerm, {
		tables: type == "all" ? [] : [type],
		queryOptions: req.queryOptions,
	})
	console.log(results)
	res.send(results[type])
})

searchRouter.get("/", async (req, res) => {
	const results = await searchTable.search(req.searchTerm, { queryOptions: req.queryOptions })
	console.log(results)

	res.send([results])
})

searchRouter.use((err, req, res, next) => {
	const status = err.status || 500

	res.status(status).send(err.message)
})

export default searchRouter
