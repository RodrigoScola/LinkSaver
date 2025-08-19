//TODO: FIGURE THIS OUT
//@ts-ignore
import config from '../../knexfile.cjs';
import knex from 'knex';
import dotenv from 'dotenv';
import { DatabaseQuery, TableNames } from '../../src/queryFilter/types';

dotenv.config();

// const db = knex(config[process.env.NODE_ENV || 'development']);
const db = knex(config['production']);

export function getTable<T extends TableNames>(type: T): DatabaseQuery<T> {
	return db('categories') as unknown as DatabaseQuery<T>;
	// return db(type) as unknown as DatabaseQuery<T>;
}
