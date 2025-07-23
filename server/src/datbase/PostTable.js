import { Table, supabase } from "./Table.js"
import { loopAsync } from "../utils.js"
import { getLinkPreview } from "link-preview-js"
import { Post } from "../class/records/PostRecord.js"


class PostExtended extends Table {
	tableName = "posts_info"

}


const postExtended = new PostExtended()

export class PostsTable extends Table {
	tableName = "posts"

	async get_by(key, value) {
		if (key == "categories") {
			value = Array.isArray(value) ? value : [value]
			let { data } = await supabase.from(this.tableName).select("*").whereIn("categories", value)

			data = await loopAsync(data, async (post) => {
				post = new Post(post.id, post)
				await post.init(true, false, true)
				return post
			})
			return data
		} else {
			const data = await super.get_by(key, value)
			return data
		}
	}
	async get_by_id(id) {
		let post = await super.get_by_id(id)
		post = new Post(post.id, post)
		return post
	}

	async update(postId, newInformation) {
		const data = await super.update(postId, newInformation)
		const extended = await postExtended.get_by_id(postId)
		let preview = null
		if (data?.post_url !== "") {
			preview = await getLinkPreview(data?.post_url)
			if (preview.images.length == 0) {
				preview.images = preview.favicons
			}
		}
		let post
		if (!extended && preview) {
			post = await postExtended.add({ id: postId, preview })
		} else {
			post = await postExtended.update(postId, { preview })
		}

		return { ...data, extended: { ...post } }
	}
}

export const postTable = new PostsTable()
export const n = new PostsTable()

