import config from '../../knexfile.cjs';
import knex from 'knex';
import { DatabaseQuery, TableNames } from '../../src/queryFilter/types';

const db = knex(config.development);

export function getTable<T extends TableNames>(type: T): DatabaseQuery<T> {
	if (type === '') {
	}
	return db(type) as unknown as DatabaseQuery<T>;
}
