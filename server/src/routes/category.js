import express from "express"
import { categoryTable } from "../datbase/CategoryTable.js"

const categoryRouter = express.Router()

categoryRouter.param("id", async (req, res, next, id) => {
	try {
		id = Number(id)

		const post = await categoryTable.get_by_id(id)
		if (post) {
			req.post = post
			next()
		}
	} catch (err) {
		res.send(err.message)
	}
})

categoryRouter.get("/:id", async (req, res) => {
	res.send(req.post)
})
categoryRouter.get("/", async (req, res) => {
	let query = req.queryOptions
	const recentPosts = await categoryTable.get_posts(query)
	res.send(recentPosts)
})

categoryRouter.post("/", async (req, res) => {
	try {
		const { cat_name, cat_color } = req.body
		const cat_id = await categoryTable.add({
			cat_name,
			cat_color,
		})
		res.send(cat_id)
	} catch (err) {
		res.send(0)
	}
})

categoryRouter.delete("/:id", async (req, res) => {
	const { id } = req.params
	const deletedata = await categoryTable.delete(id)
	res.send(deletedata)
})
categoryRouter.put("/:id", async (req, res) => {
	const { id } = req.params
	const updated = await categoryTable.update(id, { ...req.body })
	res.send(updated)
})
export default categoryRouter
