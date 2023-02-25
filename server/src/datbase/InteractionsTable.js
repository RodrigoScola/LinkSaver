const { Table, supabase } = require("./Table")
const { userstable } = require("./UsersTable")
class InteractionsTable extends Table {
	tableName = "interactions"

	async get_interaction(type, userId, postId = null) {
		let query = this.table.from(this.tableName).select("*").eq("user_id", userId)

		if (postId) {
			query = query.eq("post_id", postId)
		}
		if (type !== "all") {
			query = query.eq("type", type).maybeSingle()
		}

		const { data, error } = await query

		if (error) {
			return error
		}
		return data
	}
	async has_interaction(type, userId, postId) {
		const post_id = await this.get_interaction(type, userId, postId)

		return typeof post_id !== "undefined"
	}
	async has_like(userId, postId) {
		return this.has_interaction("like", userId, postId)
	}
	async get_by_post(post_id) {
		const { data } = await this.table.from(this.tableName).select("id, type").eq("post_id", post_id)

		return data
	}

	async interactionHandler(type, userId, postId) {
		try {
			let exists = await this.get_interaction(type, userId, postId)
			if (exists !== null) {
				await this.delete(exists.id)
				exists = {
					...exists,
					id: null,
				}
			} else {
				exists = await this.add({
					type: type,
					user_id: userId,
					post_id: postId,
				})
			}
			const {
				data: { user_id },
			} = await supabase.from("posts").select("user_id").eq("id", postId).maybeSingle()
			const data = await userstable.userInteractions(user_id)
			await userstable.update(
				user_id,
				{
					karma: data.length,
				},
				true
			)
			console.log(exists)
			return exists
		} catch (err) {
			console.log(err)
			return null
		}
	}
	async delete(postId) {
		const { data, error, status } = await supabase.from(this.tableName).delete().eq("id", postId)
		if (error || status == 204) {
			return false
		}
		return true
	}
}
const interactionsTable = new InteractionsTable()
module.exports = {
	interactionsTable,
}
