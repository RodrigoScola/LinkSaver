//@ts-ignore
import stackExchange from "stackexchange"
import  _ from "lodash"
const options = {
	version: 2.2,
}
export const context = new stackExchange({
	options: options,
})

class StackHandler {
	ctx = context
	url = null

	filter = {
		key: "a8Ya*UrPAk3IW5jS*196yw((",
		pagesize: 10,
		site: "superuser",
		sort: "activity",
		order: "asc",
	}

	async getFromId(id, site = "stackoverflow") {
		
		try {
			this.setFilter({
				site: site,
				pagesize: 1,
			})
			const data = await new Promise((resolve, rej) => {
				this.ctx.questions.questions(
					this.filter,
					(err, res) => {
						resolve(res)
					},
					[id]
				)
			})
			return data.items[0]
		} catch (err) {
			return []
		}
	}

	setFilter(items = { pagesize: null, site: null, sort: null, order: null }) {
		// console.log(items)
		const newItems = _.defaults(_.omitBy(items, _.isNil), this.filter)
		this.filter = newItems
		return newItems
	}
}

export const stackHandler = new StackHandler()
