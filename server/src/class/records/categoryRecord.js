import { getRandom } from "../../utils.js"

/** @param {{name:string , color?:string}} params */
export function newCategory  (params)  {
	return {
		cat_name: params.name,
		cat_color: params?.color || getRandom("color"),
	}
}
