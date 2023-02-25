const { getRandom } = require("../../utils")

const newCategory = (params) => {
	return {
		cat_name: params.name,
		cat_color: params?.color || getRandom("color"),
	}
}
module.exports = {
	newCategory,
}
