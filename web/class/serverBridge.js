import axiosBase from "axios"
import { loopAsync } from "../utils/formatting/utils"
import formatter from "../utils/formatting/formatting"
import { obj } from "../utils/formatting/ObjectFormat"

const url =
	process.env.NODE_ENV == "development" ? "http://localhost:3001" : "https://linksaver-server-lrtx.onrender.com";

const axios = axiosBase.create({
	baseURL: url,
})

export const USERID = "09962596-9cab-4eaf-bfba-be684cfae532"

class GetData {
	baseURL = url
	ax = axios

	defaultOptions = {
		count: 3,
	}
	getOptions(newOptions) {
		return this.defaultOptions
	}
	async getPosts(type, options = {}) {
		if (options.ids) {
			options.ids = formatter.obj.getUniques(options.ids)
			const content = await loopAsync(options.ids, async (id) => {
				const data = await this.getPost(type, id)
				return data
			})
			return content
		}
		let url = type
		if (options.params) {
			url = url + obj.toQuery(options.params)
		}
		const data = await this.getData(url)
		return data
	}
	async delete(url) {
		const data = await (await this.ax.delete(url)).data
		return data
	}
	async post(type, content) {
		const data = await (await this.ax.post(type, content)).data
		return data
	}
	async update(type, id, content) {
		const data = await (await this.ax.put(type + "/" + id, content)).data
		return data
	}
	async getPost(type, id) {
		const data = await (await this.ax.get(type + "/" + id)).data
		return data
	}
	async getData(url, options = null) {
		const data = await (await this.ax.get(url, options)).data

		return data
	}
	async getPostData(type, post) {
		if (type == "folder") {
			const uniqueIds = formatter.obj.getUniques(post.items)
			const items = []
			uniqueIds.map((post) => {
				items.push(getData.getPost(post.type, post.id))
			})

			const res = await Promise.all(items)

			return {
				...post,
				items: [...res],
			}
		} else if (type == "post") {
		}
	}
}

export const getData = new GetData()

export default axios
