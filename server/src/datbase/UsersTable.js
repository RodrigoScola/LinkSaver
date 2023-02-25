const { Table, supabase } = require("./Table")

class UsersTable extends Table {
	tableName = "profiles"

	async getExtended(id) {
		const { data } = await supabase.from("profiles_info").select("*").eq("id", id).single()

		if (data) {
			return data
		}
		return {}
	}
	async userInteractions(userId) {
		const { data: allPosts } = await supabase
			.from("posts")
			.select("id")
			.eq("user_id", userId)
			.eq("status", "public")
		const postIds = allPosts.reduce((all, item) => {
			all.push(item.id)
			return all
		}, [])
		const { data: allInteractions } = await supabase.from("interactions").select("post_id").in("post_id", postIds)
		return allInteractions
	}
	async update(userId, newInfo, extended = false) {
		if (extended == false) {
			const data = await super.update(userId, newInfo)
			return data
		} else {
			const { data } = await supabase.from("profiles_info").update(newInfo).eq("id", userId).select()
			return data
		}
	}
}

const userstable = new UsersTable()

module.exports = { userstable }
