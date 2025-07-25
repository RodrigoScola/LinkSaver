import { DatabaseQuery, TableNames } from './queryFilter/types';

export function privatizeItem(query: DatabaseQuery<TableNames>) {
	return query.update('status', 'private');
}
