import express from 'express'
import { interactionsTable } from "../datbase/InteractionsTable.js"
import { postTable } from "../datbase/PostTable.js"
import _ from 'lodash'
import { RangeQueryType } from "../datbase/Query.js"
import { Post} from "../class/records/PostRecord.js"
const postRouter = express.Router()

postRouter.param("id", async (req, res, next, id) => {
	try {
		const post = await postTable.get_by_id(id)
		if (post) {
			req.post = post
			next()
		}
	} catch (err) {
		next(err)
	}
})

postRouter.post("/:id", async (req, res) => {
	if (req.query.type) {
		console.log(req.body)
		const has = await interactionsTable.interactionHandler(req.query.type, req.body.user_id, req.params.id)

		res.send(has)
	}
})

postRouter.get("/:id", async (req, res) => {
	if (req.query.extended) {
		const ex = await postTable.getExtended(req.post.id)
		req.post = { ...req.post, ...ex }
	}
	res.send(req.post)
})
postRouter.get("/", async (req, res) => {
	let options = [new RangeQueryType(0, 10)]
	if (req.queryOptions) {
		options = [...options, ...req.queryOptions]
	}
	let recentPosts = await postTable.get_posts(options)
	res.send(recentPosts)
})

postRouter.post("/", async (req, res) => {
	try {
		console.log(req.body)
		const po = new Post(null, req.body)
		console.log(po)
		const data = await postTable.add({
			title: po.title,
			categories: _.flattenDeep(po.categories).filter((item) => item),
			post_url: po.post_url,
			user_id: po.userId,
		})
		console.log(data)
		if (data.post_url) {
			await postTable.update(data.id, { post_url: data.post_url })
		}
		res.send(data)
	} catch (err) {
		res.send("cant")
	}
})

postRouter.delete("/:id", async (req, res) => {
	const { id } = req.params
	// setTimeout(() => {b
	// 	res.send({ message: "isDeleted" })
	// }, 100)
	const deletedata = await postTable.delete(id)
	console.log(deletedata)
	res.send(deletedata)
})
postRouter.put("/:id", async (req, res) => {
	const { id } = req.params
	const post = Post.New(req.body)
	const updated = await postTable.update(id, post)
	console.log(updated)
	res.send(updated)
})

postRouter.use((err, req, res, next) => {
	res.send(err)
})

export default postRouter
