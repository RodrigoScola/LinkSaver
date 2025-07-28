//todo: add object pooling maybe
export class AsyncQueue {
	private promises: Promise<unknown>[];
	results: Record<string, PromiseSettledResult<unknown>>;
	constructor() {
		this.promises = [];
		this.results = {};
	}

	public Add(key: string, prom: Promise<unknown>): AsyncQueue {
		this.results[key] = {
			status: 'rejected',
			reason: undefined,
		};
		const fn = prom.then(
			(v) => {
				this.results[key] = {
					status: 'fulfilled',
					value: v,
				};

				return v;
			},
			(v: unknown) => {
				this.results[key] = {
					status: 'rejected',
					reason: v,
				};
				return v;
			}
		);
		this.promises.push(fn);

		return this;
	}

	//not recommended but sometimes can be nice
	public GetResult(key: string): unknown {
		if (!(key in this.results)) {
			return;
		}

		return this.results[key].status === 'fulfilled' ? this.results[key].value : this.results[key].reason;
	}

	public Get(key: string): PromiseSettledResult<unknown> {
		if (!key) {
			return {
				status: 'rejected',
				reason: 'key was never here',
			};
		}

		return this.results[key];
	}

	public async Build() {
		return Promise.allSettled(this.promises);
	}
}
