import config from '../../knexfile.cjs';
import knex from 'knex';
import { DatabaseQuery, TableNames } from '../../src/queryFilter/types.js';

const db = knex(config.development);

export function getTable<T extends TableNames>(type: TableNames): DatabaseQuery<T> {
	return db(type) as unknown as DatabaseQuery<T>;
}
