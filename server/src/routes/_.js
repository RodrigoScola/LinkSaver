const express = require("express")
const { getLinkPreview } = require("link-preview-js")

const utilRouter = express.Router()

utilRouter.get("/getPreview", async (req, res) => {
	try {
		const url = new URL(req.query.url)
		const data = await getLinkPreview(url.href)
		return res.send(data)
	} catch (err) {
		return res.send("invalid url on query parameter")
	}
})

module.exports = utilRouter
