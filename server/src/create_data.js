// const { faker } = require("@faker-js/faker")
// const fs = require("fs")

// const callfunc = (obj) => {
// 	const res = []

// 	Object.values(obj).map((value) => {
// 		if (typeof value === "function") {
// 			res.push(value.call())
// 		}
// 	})
// 	return res
// }

// const getRandom = (obj) => {
// 	const res = callfunc(obj)

// 	return res[Math.floor(Math.random() * res.length)]
// }

// const newItem = () => {}

// const res = {
// 	colors: [],
// }
// const genItem = (num) => {
// 	const items = []
// 	for (let i = 0; i <= num; i++) {
// 		const type = "categories"

// 		const item = res["categories"][Math.floor(Math.random() * res.categories.length)]

// 		items.push({
// 			type,
// 			item: item.id,
// 		})
// 	}
// 	return items
// }

// for (let i = 0; i < 15000; i++) {
// 	res.colors.push(faker.color.rgb({ format: "hex" }))
// }

// try {
// 	fs.writeFileSync("./basedata.json", JSON.stringify(res))
// 	// file written successfully
// } catch (err) {
// 	console.error(err)
// }
