import  knex  from 'knex'
import { QueryOptions  } from "./Query.js"

import config from '../../knexfile.js'
import  d  from "dotenv" 

d.config()


/**
 * @type {import('knex').Knex}
 */
export const supabase = knex(config.development)







export class Table {
	tableName = "defaulttable"
	table = supabase

	/**
	 *
	 *
	 * @param {number | number[]} id
	 * @param {*} [baseOptions=[]]
	 * @memberof Table
	 */
	async get_by_id(id, baseOptions = []) {
		try {
			if (Array.isArray(id)) {
				let { data } = await supabase.from(this.tableName).select("*").whereIn("id", id)
				return data
			}
			const op = new QueryOptions(supabase.from(this.tableName).select("*").eq("id", id), baseOptions)
			const { data: post, error } = await op.options.single()
			if (post) {
				return {
					type: this.tableName,
					...post,
				}
			}
			return null
		} catch (err) {
			return {}
		}
	}
	async get_all(type) {
		const { data } = await supabase.from(this.tableName).select(type)
		if (!data) {
			return []
		}
		return data.reduce((curr, item) => {
			curr = [...curr, item[type]]
			return curr
		}, [])
	}
	async get_posts(optionsParam = []) {
		let query = supabase.from(this.tableName).select("*").eq("status", "public")

		let options = new QueryOptions(query, optionsParam)

		const { data, error } = await options.options.order("id", { ascending: false })
		if (error) {
			return []
		}

		return data.map((item) => {
			return {
				type: this.tableName,
				...item,
			}
		})
	}
	async getExtended(postId) {
		const { data, error } = await supabase.from("posts_info").select("*").eq("id", postId).maybeSingle()
		return data
	}
	async add(params, options = []) {
		const { data, error, status } = await supabase.from(this.tableName).insert(params).select().maybeSingle()
		if (error) {
			console.log(error, status)
		}
		return data
	}
	async addOrRetrieve(obj = [{ key: value }], params) {
		const items = Object.entries(obj)
		let query = supabase.from(this.tableName).select("*")

		items.forEach((item) => {
			query = query.eq(item[0], item[1])
		})
		let { data } = await query.maybeSingle()
		if (data == null) {
			data = await this.add(params)
		}
		return data
	}
	async update(postId, newInformation) {
		const { data, error, status } = await supabase
			.from(this.tableName)
			.update(newInformation)
			.eq("id", postId)
			.select()
			.single()

		return data
	}
	async delete(postId) {
		try {
			const update = await this.update(postId, { status: "private" })
			return true
		} catch (err) {
			return false
		}
	}
	async getPostsById(postId) {
		const { data } = await supabase.rpc("get_posts_of_" + this.tableName, { id: postId })
		console.log(this.tableName)

		return data
	}
	async get_by(key, value) {
		const { data, error } = await supabase.from(this.tableName).select("*").eq(key, value).select()
		return data
	}
}

