import type { Knex } from 'knex';
import { ContextFactory } from './DatabaseContext';

export type Tables = import('knex/types/tables').Tables;

export type TableNames = keyof Tables;

export type DatabaseQuery<T extends TableNames, RequiredProps extends object = Tables[T]> = Knex.QueryBuilder<
	Tables[T] & RequiredProps
>;

export interface ContextInstance<T extends TableNames> {
	GetQuery(): DatabaseQuery<T>;
	Build(): DatabaseQuery<T>;
	SetParameters<T extends object>(parameters: ContextParameters<T> | undefined): this;
}

export enum SEARCH_MODE {
	NATURAL_LANGUAGE = 1,
	NATURAL_LANGUAGE_WITH_QUERY = 2,
	BOOLEAN_MODE = 3,
	WITH_QUERY_EXPANSION = 4,
}

export enum ParameterActions {
	ORDER = 'order',
	ORDER_BY = 'orderBy',
	LIMIT = 'limit',
	OFFSET = 'offset',
	SELECT = 'select',
	SEARCH = 'search',
	SEARCH_ON = 'search_on',
	SEARCH_MODE = 'search_mode',
}
export type ContextSearch<T extends object> = {
	match: keyof T | (keyof T)[];
	term: string;
	search_mode?: SEARCH_MODE;
};

export type Orders = 'asc' | 'desc';

export type ContextOrderBy<T extends object> = {
	column: keyof T;
	order?: Orders;
};

export type ContextParameters<T extends object> = {
	select?: (keyof T)[] | undefined;
	orders?: ContextOrderBy<T>[];
	limit?: number;
	offset?: number;
	search?: ContextSearch<T>;
	where?: Partial<{
		[K in keyof T]: T[K] | undefined;
	}>;
	whereIn?: {
		key: keyof T;
		value: T[keyof T][];
	};
};

export const ContextParametersObj: ContextParameters<{ id: number }> = {
	select: ['id'],
	orders: [{ column: 'id', order: 'asc' }],
	limit: 34,
	offset: 3,
	where: {
		id: 3,
	},
};

export type AvailableContextItems = keyof (typeof ContextFactory)['items'];

export type ContextInfoProps<T extends object> = {
	ignoreWithStatus?: ItemStatus[] | ItemStatus | null | undefined;
	parameters?: ContextParameters<T> | undefined;
};
