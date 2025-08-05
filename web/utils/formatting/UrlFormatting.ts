export class UrlFormatting {
	static parseUrl(url: string) {
		try {
			const { origin, pathname, searchParams } = new URL(url, 'http://dummy'); // dummy origin for relative URLs

			const query: Record<string, string> = {};
			searchParams.forEach((value, key) => {
				query[key] = value;
			});

			return {
				url: `${origin}${pathname}`.replace('http://dummy', ''), // strip dummy origin if needed
				query,
			};
		} catch (err) {
			console.error('Invalid URL:', url);
			return {
				url,
				query: {},
			};
		}
	}

	/** @param {string} url */
	static isValid(url: string) {
		try {
			return Boolean(new URL(url));
		} catch (err) {
			return false;
		}
	}
}
