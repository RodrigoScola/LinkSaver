const express = require("express")
const { foldersTable } = require("../datbase/FoldersTable")
const { RangeQueryType, EqualQueryType } = require("../datbase/Query")
const foldersRouter = express.Router()

foldersRouter.param("id", async (req, res, next, id) => {
	const folderId = id
	try {
		const folder = await foldersTable.get_by_id(id)
		if (folder) {
			req.post = folder
		} else {
			throw new Error("folder not found")
		}

		next()
	} catch (err) {
		next(err)
	}
})

foldersRouter.get("/:id", async (req, res) => {
	let post = req.post

	res.send(post)
})
foldersRouter.get("/", async (req, res) => {
	const recentPosts = await foldersTable.get_posts([...req.queryOptions])
	res.send(recentPosts)
})
foldersRouter.post("/", async (req, res) => {
	// try {
	console.log(req.body)
	const { name, color, items, parent_folder, user_id } = req.body
	let data

	const exists = await foldersTable.get_posts([
		new EqualQueryType("name", name),
		new EqualQueryType("user_id", user_id),
		new RangeQueryType(0, 10),
	])

	if (!exists[0]) {
		data = await foldersTable.add({
			name,
			user_id,
			color,
			parent_folder,
		})
	} else {
		data = foldersTable.update(exists.id, {
			...exists,
			name,
			parent_folder,
			color,
			items: {
				...exists.items,
				...items,
			},
		})
	}

	// 	res.send(data)
	// } catch (err) {
	// 	console.log(err)
	// }
})
foldersRouter.post("/:id", async (req, res) => {
	const id = req.post.id
	const post_id = req.body.post_id
	const type = req.body.type
	res.send("aoisdfj")
	try {
		const data = await foldersTable.addItem(id, { id: post_id, type: type })
		res.send(data)
	} catch (err) {}
})
foldersRouter.put("/:id", async (req, res) => {
	const { id } = req.params

	const updated = await foldersTable.update(id, { ...req.body })
	res.send(updated)
})
module.exports = foldersRouter
