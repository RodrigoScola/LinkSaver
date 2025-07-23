import { postTable } from "./PostTable.js"
import { Table } from "./Table.js"

class CategoryTable extends Table {
	tableName = "category"

	async getPostsById(postId) {
		const data = await postTable.get_by("categories", postId)
		return data
	}
}

export const categoryTable = new CategoryTable()

