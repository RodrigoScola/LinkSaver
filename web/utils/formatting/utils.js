import formatter from "./formatting"
export const BASEURL =
	process.env.NODE_ENV == "development" ? "http://localhost:3000" : "https://overflowsaver.vercel.app"
export const isDifferent = (a, b) => {
	return JSON.stringify(a) != JSON.stringify(b)
}
export const newPost = (
	options = {
		title: "",
		id: "",
		post_url: "",
		categories: [],
		userId: "",
		folder: null,
	}
) => {
	return {
		title: options.title,
		post_url: formatter.url.isValid(options.post_url) == true ? options.post_url : "",
		id: options.id,
		folder: options.folder,
		categories: options.categories,
		userId: options.userId,
		...options,
	}
}
export const newCategory = (
	options = {
		id: "",
		cat_name: "",
		cat_color: "",
	}
) => {
	return {
		id: options.id || null,
		cat_name: options.cat_name || options.name || "",
		cat_color: options.cat_color || options.color || "#000000",
		...options,
	}
}
export const newFolder = (options = { name: "", color: "", items: [], id: 0, parent_folder: 0 }) => {
	return {
		name: options.name,
		id: options.id,
		parent_folder: options.parent_folder || 0,
		color: options.color,
		items: options.items ? (Array.isArray(options.items) == true ? options.items : [options.items]) : [],
		...options,
	}
}
const newInteraction = (
	options = {
		type: "",
		id,
		created_at: null,
		user_id: null,
		post_id: null,
	}
) => {
	return {
		type: options.type,
		id: options.id,
		created_at: options.created_at || null,
		user_id: options.user_id,
		post_id: options.post_id,
	}
}
export const newItem = (type, options = null) => {
	switch (type) {
		case "post":
			return newPost(options)
		case "category":
			return newCategory(options)
		case "folder":
			return newFolder(options)
		case "interaction":
			return newInteraction(options)
		default:
			return {}
	}
}

export const loopAsync = async (obj, callable) => {
	if (!Array.isArray(obj)) {
		const returned = await callable(obj)

		if (typeof returned !== "undefined") {
			obj = returned
		}
		return obj
	}
	const nobj = []
	for (const i in obj) {
		const currObj = obj[i]
		const returned = callable(currObj)

		if (typeof returned !== "undefined") {
			nobj.push(returned)
		}
	}
	const res = Promise.all(nobj)
	return res
}
