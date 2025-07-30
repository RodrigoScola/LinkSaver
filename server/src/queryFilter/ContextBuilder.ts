import { IsInEnum as isInEnum, isKeyof } from './utils';
import { ContextParameters, Orders, ParameterActions, SEARCH_MODE } from './types';
import { ContextFormatter } from './ContextFormatter';

type SearchAction<Obj extends object = object> = Obj & {
	[ParameterActions.SEARCH]: string;
	[ParameterActions.SEARCH_ON]: keyof Obj | (keyof Obj)[];
};

type QueryProps = {
	strictPropertyNames?: boolean;
};

class QueryBuilderFactorySingleton {
	FromParameters<T extends object>(
		query: qs.ParsedQs | URLSearchParams | null | undefined | object,
		tableItem?: T,
		props?: QueryProps
	): ContextParameters<T> {
		return this.Make(ContextFormatter.Format(query), tableItem, props);
	}

	Remove<T extends object>(key: keyof ContextParameters<T>, item: ContextParameters<T>) {
		if (key in item) {
			delete item[key];
		}
		return this;
	}

	// busca de nome e refId na criação de campanhas
	Search<T extends object>(
		item: object & { search_mode?: string | number },
		validItem: T,
		param: ContextParameters<T>,
		props?: QueryProps
	): this {
		if (
			!(ParameterActions.SEARCH in item) ||
			typeof item.search !== 'string' ||
			!(ParameterActions.SEARCH_ON in item) ||
			(typeof item.search_on !== 'string' &&
				props &&
				props.strictPropertyNames &&
				typeof validItem[item.search_on as keyof T] === 'undefined')
		) {
			return this;
		}

		param.search = {
			term: item.search,
			search_mode: Number(item.search_mode) || SEARCH_MODE.BOOLEAN_MODE,
			match: item.search_on as keyof T | (keyof T)[],
		};

		if (!param.search.search_mode) {
			param.search.search_mode = SEARCH_MODE.BOOLEAN_MODE;
		}

		if (param.search.search_mode && param.search.search_mode === SEARCH_MODE.BOOLEAN_MODE) {
			param.search.term = `${item.search}*`;
		}

		if (
			!(ParameterActions.SEARCH_MODE in item) ||
			typeof item.search_mode !== 'string' ||
			!isInEnum(Number(item.search_mode), SEARCH_MODE as unknown as Record<string, number>)
		) {
			return this;
		}

		param.search.search_mode = Number(item.search_mode);

		return this;
	}
	Select<K extends object>(item: object, tableItem: K, final: ContextParameters<K>): this {
		if (
			!(ParameterActions.SELECT in item) ||
			typeof item.select !== 'string' ||
			!(item.select in tableItem)
		) {
			return this;
		}
		const selected = item.select.split(',').filter((item) => item);
		if (selected.length > 0) {
			//@ts-expect-error funciona sim
			final.select = selected;
		}
		return this;
	}
	Order<Valid extends object>(item: object, final: ContextParameters<Valid>): this {
		if (
			!(ParameterActions.ORDER_BY in item) ||
			ParameterActions.ORDER_BY in final ||
			(typeof item.orderBy !== 'string' && !Array.isArray(item.orderBy))
		) {
			return this;
		}

		const order: Orders = 'asc';

		if (!Array.isArray(item.orderBy)) {
			item.orderBy = [item.orderBy];
		}

		//TODO: MAKE THIS PRETTY
		//@ts-expect-error guardar por array?
		final.orders = [...item.orderBy].reduce((acc, key, i) => {
			let currentOrder: 'asc' | 'desc' = order;

			if (!('order' in item) || !item.order) {
				acc.push({ column: key, order: currentOrder });
				return acc;
			}

			if (typeof item.order === 'string' && (item.order === 'asc' || item.order === 'desc')) {
				currentOrder = item.order;
			}
			if (
				Array.isArray(item.order) &&
				item.order[i] &&
				(item.order[i] === 'asc' || item.order[i] === 'desc')
			) {
				currentOrder = item.order[i];
			}

			acc.push({ column: key, order: currentOrder });

			return acc;
		}, []);

		return this;
	}

	WhereIn<Obj extends object, Key extends keyof Obj, Value extends Obj[Key]>(
		key: Key,
		value: Value | Value[],
		tableItem: Obj,
		final: ContextParameters<Obj>
	): this {
		if (!Array.isArray(value)) {
			return this;
		}
		if (typeof tableItem[key] === 'number') {
			value = value.map((item) => Number(item)) as Value[];
		}
		final.whereIn = {
			key: key as keyof Obj,
			value: value as Obj[keyof Obj][],
		};
		return this;
	}
	Where<Obj extends object, Key extends keyof Obj, Value extends Obj[Key]>(
		key: Key,
		value: Value,
		tableItem: Obj,
		final: ContextParameters<Obj>
	): this {
		if (typeof tableItem[key] === 'number') {
			//@ts-expect-error i want to try some language where this cant happen
			//would be interesting to see
			value = Number(value);
		}

		if (final.where) {
			final.where[key] = value;
			return this;
		}

		//@ts-expect-error idk man
		final.where = {
			[key as keyof Obj]: value as Obj[keyof Obj],
		};
		return this;
	}
	Make<T extends object>(
		item: object | undefined | null | qs.ParsedQs,
		tableItem?: T,
		props?: QueryProps
	): ContextParameters<T> {
		const final: ContextParameters<T> = {
			limit: 10,
		};

		if (!item) return final;
		this.Order(item, final);

		if ('offset' in item && (typeof item.offset === 'string' || typeof item.offset === 'number')) {
			const offset = Number(item.offset);
			if (!isNaN(offset)) final.offset = offset;
		}
		if ('limit' in item && (typeof item.limit === 'string' || typeof item.limit === 'number')) {
			const limit = Number(item.limit);
			if (!isNaN(limit)) final.limit = limit;
		}

		if (!tableItem) return final;

		this.Search(item as SearchAction<T>, tableItem, final, props)
			.Select(item, tableItem, final)
			.Order(item, final);

		Object.entries(item).forEach(([key, value]) => {
			if (!isKeyof(key, tableItem)) {
				return;
			}
			if (!final.whereIn && Array.isArray(value)) {
				this.WhereIn(key, value, tableItem, final);
				return;
			}

			this.Where(key, value, tableItem, final);
		});

		return final as ContextParameters<T>;
	}
}

export const ContextBuilder = new QueryBuilderFactorySingleton();
