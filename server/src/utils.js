import path from 'path'
import fs from 'fs'

export const loopAsync = async (obj, callable) => {
	if (!Array.isArray(obj)) {
		const returned = await callable(obj);

		if (typeof returned !== "undefined") {
			obj = returned;
		}
		return obj;
	}
	const nobj = [];
	for (const i in obj) {
		const currObj = obj[i];
		const returned = callable(currObj);

		if (typeof returned !== "undefined") {
			nobj.push(returned);
		}
	}
	return Promise.all(nobj);
};

export function deepSearch(object, key, predicate = null) {
	if (object.hasOwnProperty(key)) {
		if (predicate !== null) {
			return predicate(key, object);
		}
		return object;
	}
	for (let i = 0; i < Object.keys(object).length; i++) {
		let value = object[Object.keys(object)[i]];
		if (typeof value === "object" && value != null) {
			let o = deepSearch(object[Object.keys(object)[i]], key, predicate);
			if (o != null) return o;
		}
	}
	return null;
}

export const getRandom = (type) => {
	const file = JSON.parse(
		fs.readFileSync(path.join(__dirname, "/class/basedata.json"), {
			encoding: "utf-8",
		})
	);
	switch (type) {
		case "color":
			const obj = file[type];
			const randomNum = Math.floor(Math.random() * obj.length);
			return obj[randomNum];

		default:
			return file;
	}
};
const postsColumns = {
	id: 0,
	createdAt: Date.now(),
	title: "",
	categories: [],
	user_id: "",
	post_url: "",
	status: "",
	likes: "",
	extended: {
		id: 0,
		created_at: Date.now(),
		likes: 0,
		preview: {},
	},
	getColumns: () => {
		return Object.keys(postsColumns).concat(Object.keys(postsColumns.extended));
	},
};

/** @param {string} type */
export function getColumns(type) {
	switch (type) {
		case "posts":
			return [""];
	}
}

