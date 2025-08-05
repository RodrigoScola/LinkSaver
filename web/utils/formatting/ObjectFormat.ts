export class ObjectFormat {
	static deepSearch<T extends Record<string, any>>(
		obj: T,
		key: string,
		predicate?: (key: string, obj: T) => any
	): any | null {
		if (obj == null || typeof obj !== 'object') return null;

		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			return predicate ? predicate(key, obj) : obj;
		}

		for (const val of Object.values(obj)) {
			if (typeof val === 'object' && val !== null) {
				const result = this.deepSearch(val, key, predicate);
				if (result !== null) return result;
			}
		}

		return null;
	}

	static toObj<
		T extends Record<string, any>,
		K extends keyof T,
		Key extends PropertyKey = Extract<T[K], PropertyKey>
	>(arr: T[], key: K): Record<Key, T> {
		const res = {} as Record<Key, T>;

		for (const item of arr) {
			const kvalue = item[key] as Key;
			res[kvalue] = item;
		}

		return res;
	}
}
