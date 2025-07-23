export  class SearchColumn {
	constructor(tableName) {
		this.tableName = tableName
	}
	get searchColumn() {
		switch (this.tableName) {
			case "categories":
				return "cat_name"
			case "posts":
				return "title"
			case "folders":
				return "name"
			case "profiles":
			case "users":
				return "username"
		}
	}
}

export class TableColumns {
	constructor(tableName) {
		this.columns = null
		switch (tableName) {
			case "categories":
				this.columns = new CategoryCollumns()
		}
	}
}
export class CategoryCollumns {
	constructor() {
		this.id = ""
		this.created_at = ""
		this.cat_name = ""
		this.cat_color = ""
		this.items = []
		this.status = ""
	}
}

