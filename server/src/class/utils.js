import { categoryTable } from "../datbase/CategoryTable.js"
import { postTable } from "../datbase/PostTable.js"
import { foldersTable } from "../datbase/FoldersTable.js"
import { interactionsTable } from "../datbase/InteractionsTable.js"
import { userstable } from "../datbase/UsersTable.js"

export function getTable(type) {
	let table = postTable
	switch (type) {
		case "posts":
			return (table = postTable)
		case "categories":
		case "category":
			return (table = categoryTable)

		case "folders":
		case "folder":
			return (table = foldersTable)
		case "users":
			return (table = userstable)
		case "interactions":
			return (table = interactionsTable)
	}
	return table
}
