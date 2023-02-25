export class UrlFormatting {
	#_url = ""
	constructor(url = "") {
		this.#_url = url
	}
	parseUrl(url) {
		const query = url
			.split("/?")[1]
			.split("&")
			.reduce((curr, item) => {
				const nitems = item.split("=")
				curr[nitems[0]] = nitems[1]
				return curr
			}, {})
		const nurl = url.split("/?")[0]
		return {
			url: nurl,
			query: query,
		}
	}
	isValid(url = "") {
		if (!url) {
			url = this.#_url
		}
		try {
			return Boolean(new URL(url))
		} catch (err) {
			return false
		}
	}
	get url() {
		if (this.isValid()) {
			return new URL(this.#_url)
		}
		return this.#_url
	}
	set url(newUrl) {
		if (this.isValid(newUrl)) {
			this.#_url = new URL(newUrl)
		}
	}
}
