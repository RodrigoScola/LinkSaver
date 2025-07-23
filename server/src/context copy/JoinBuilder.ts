import { ContextOrderBy, ContextParameters, ContextSearch } from './types';

type TableItem = {
	name: string;
	value: object;
};

export type JoinKeys<T extends TableItem[]> = {
	[P in T[number] as `${P['name']}.${keyof P['value'] &
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		string}`]: P['value'] extends Record<any, infer U> ? U : never;
};

export class Joinbuilder {
	Make<T extends object, Tables extends TableItem[], N extends ContextParameters<JoinKeys<Tables>>>(
		params: ContextParameters<T>,
		tables: Tables
	): N {
		const p: N = {
			limit: params.limit,
		} as N;

		if (params.offset) {
			p.offset = params.offset;
		}

		//handling select
		if (params.where) {
			p.where = this.SetWhere<T, Tables>(params, tables);
		}
		if (params.orders) {
			p.orders = this.SetOrder<T, Tables>(params.orders, tables);
		}

		if (params.search) {
			p.search = this.SetSearch<T, Tables>(params.search, tables);
		}

		if (params.select) {
			p.select = this.SetSelect<T, Tables>(params.select, tables);
		}

		return p as N;
	}
	private SetSelect<T extends object, Tables extends TableItem[]>(select: (keyof T)[], tables: Tables) {
		const newSelect: (keyof JoinKeys<Tables>)[] = [];

		for (const item of select) {
			if (typeof item !== 'string') continue;
			for (const table of tables) {
				if (!Object.keys(table.value).includes(item)) {
					continue;
				}
				newSelect.push(`${table.name}.${item}` as keyof JoinKeys<Tables>);
			}
		}
		return newSelect;
	}

	private SetSearch<T extends object, Tables extends TableItem[]>(search: ContextSearch<T>, tables: Tables) {
		const newSearch: ContextSearch<JoinKeys<Tables>> = {
			match: '' as keyof JoinKeys<Tables>,
			term: search.term,
			search_mode: search.search_mode,
		};

		for (const table of tables) {
			if (!Object.keys(table.value).includes(search.match as string)) continue;

			newSearch!.match = `${table.name}.${search.match.toString()}` as keyof JoinKeys<Tables>;
		}

		return newSearch;
	}

	private SetOrder<T extends object, Tables extends TableItem[]>(
		orders: ContextOrderBy<T>[],
		tables: Tables
	): ContextOrderBy<JoinKeys<Tables>>[] {
		const newOrders: ContextOrderBy<JoinKeys<Tables>>[] = [];
		const unusedItems = new Map<string, ContextOrderBy<T>>();

		for (const item of orders) {
			if (typeof item !== 'object') continue;
			unusedItems.set(item.column.toString(), item);
			for (const table of tables) {
				const column = item.column.toString();

				if (!Object.keys(table.value).includes(column)) {
					continue;
				}

				unusedItems.delete(item.column.toString());

				newOrders.push({
					column: `${table.name}.${column}` as string as keyof JoinKeys<Tables>,
					order: item.order,
				});
			}
		}
		for (const unusedItem of unusedItems) {
			newOrders.push({
				column: `${unusedItem[1].column.toString()}` as string as keyof JoinKeys<Tables>,
				order: unusedItem[1].order,
			});
		}
		return newOrders;
	}
	//    where?: Partial<{
	//       [K in keyof T]: T[K] | undefined;
	//    }>;

	private SetWhere<T extends object, Tables extends TableItem[]>(
		params: ContextParameters<T>,
		tables: Tables
	): Partial<JoinKeys<Tables>> {
		const where: Partial<JoinKeys<Tables>> = {};

		for (const item in params.where) {
			if (typeof item !== 'string') continue;
			for (const table of tables) {
				if (!Object.keys(table.value).includes(item)) {
					continue;
				}
				//@ts-expect-error dude come on...
				where[`${table.name}.${item}`] = params.where[item];
			}
		}
		return where;
	}
}
