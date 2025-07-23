import { Table, supabase } from "./Table.js"

class Folder {
	constructor(options = { id }) {
		this.id = options.id
		this.created_at = options?.created_at
		this.name = options.name ? options.name : ""
		this.color = options.color ? options.color : ""
		this.items = options.items ? options.items : []
		this.type = "folders"
	}
	async setInfo(newInfo) {
		if (newInfo) {
			Object.keys(newInfo).map((key) => {
				this[key] = newInfo[key]
			})
		}

		return this.info
	}
	async getInfo() {
		const { data } = await supabase.from("folders").select("*").eq("id", this.id).single()

		this.setInfo(data)
		return this.info
	}
	formatInfo(item) {
		let returnObj = this.info
		Object.keys(item).map((key) => {
			returnObj[key] = item[key]
		})
		return returnObj
	}

	async addIem(item = { id, type }) {
		const { items } = await this.getInfo()
		// const items = []
		if (!items.some((currItem) => currItem.id == item.id || currItem.type == item.type)) {
			const { data } = await supabase
				.from("folders")
				.update({ items: [...items, item] })
				.eq("id", this.id)
				.select()
			this.setInfo(data)
			return this.info
		}
		return this.info
	}

	get info() {
		return {
			id: this.id,
			created_at: this.created_at,
			name: this.name,
			color: this.color,
			items: this.items,
			type: this.type,
		}
	}
}

class Folders extends Table {
	tableName = "folders"

	async get_by_id(id) {
		try {
			const data = await super.get_by_id(id)
			const mod = new Folder({ ...data })
			const modingo = await mod.getInfo()

			return mod.info
		} catch (err) {
			return new Folder(-1)
		}
	}
	async addItem(postId, item) {
		const folder = new Folder({ id: postId })

		const data = await folder.addIem(item)
		return data
	}

	async getPostsById(postId) {
		console.log("aaaaa")
		const { data: items, error } = await supabase.rpc("get_posts_of_folders", { folder_id: postId })
		if (!items || error) return []
		console.log(items)
		const folders = items.reduce((curr, item) => {
			let query = supabase.from(item.type)

			if (item.type == "folders") {
				query = query.select(`id, created_at,name,parent_folder, color, status,user_id`)
			} else if (item.type == "posts") {
				query = query.select("title, post_url,categories, user_id, status")
			}
			query = query.eq("id", item.item_id).single()
			curr.push(query)
			return curr
		}, [])
		const data = await Promise.all(folders)
		if (!data) return items
		console.log(data)
		return items.map((item, idx) => ({ ...item, ...data[idx].data }))
	}
	async add(params, options = {}) {
		const data = await super.add(params, options)
		console.log(params)
		if (params?.parent_folder) {
			const parentFolder = await this.get_by_id(params.parent_folder)

			super.update(parentFolder.id, {
				items: [
					...parentFolder.items,
					{
						type: "folders",
						id: data.id,
					},
				],
			})
		}
		return data
	}
}
export const foldersTable = new Folders()
