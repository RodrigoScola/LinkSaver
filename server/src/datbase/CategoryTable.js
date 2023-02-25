const { postTable } = require("./PostTable")
const { Table } = require("./Table")

class CategoryTable extends Table {
	tableName = "category"

	async getPostsById(postId) {
		const data = await postTable.get_by("categories", postId)
		return data
	}
}

const categoryTable = new CategoryTable()

module.exports = {
	categoryTable,
}
