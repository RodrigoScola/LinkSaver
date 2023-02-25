const { categoryTable } = require("../datbase/CategoryTable")
const { postTable } = require("../datbase/PostTable")
const { foldersTable } = require("../datbase/FoldersTable")
const { interactionsTable } = require("../datbase/InteractionsTable")
const { userstable } = require("../datbase/UsersTable")

function getTable(type) {
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

module.exports = {
	getTable,
}
