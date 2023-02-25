class StackUrl {
	#_url = ""
	#_type = ""
	#_id = ""
	#_site = ""
	constructor(url = null) {
		if (url !== null) {
			this.#_url = url
			const { id, site, type } = this.#formatUrl()
			this.#_type = type
			this.#_id = id
			this.#_site = site
		}
	}
	#formatUrl() {
		const url = new URL(this.#_url)
		console.log(url.host.split(".")[0])
		return {
			site: url.host.split(".")[0],
			type: url.pathname.split("/").slice(1)[0],
			id: url.pathname.split("/").slice(1)[1],
		}
	}
	get type() {
		if (!this.#_type) {
			return this.#formatUrl.type
		}
		return this.#_type
	}
	get site() {
		if (!this.#_site) {
			this.#_site = this.#formatUrl().site
		}
		return this.#_site
	}
	get id() {
		if (!this.#_id) {
			this.#_id = this.#formatUrl().id
		}

		return this.#_id
	}
}

module.exports = {
	StackUrl,
}
