import express from 'express'
import { userstable } from "../datbase/UsersTable.js"

 const usersRouter = express.Router()

usersRouter.get("/:id", async (req, res) => {
	const { id: categoryId } = req.params
	let post = await userstable.get_by("id", categoryId)
	let extended
	if (!post) {
		post = await userstable.get_by("username", categoryId)
	}
	if (req.query["extended"]) {
		extended = await userstable.getExtended(post[0].id)
	}
	res.send({ ...extended, ...post[0] })
})
usersRouter.get("/", async (req, res) => {
	const recentPosts = await userstable.get_posts({
		postCount: 10,
	})
	res.send(recentPosts)
})

usersRouter.put("/:id", async (req, res) => {
	const { id } = req.params

	const updated = await userstable.update(id, { ...req.body })
	res.send(updated)
})

export default usersRouter