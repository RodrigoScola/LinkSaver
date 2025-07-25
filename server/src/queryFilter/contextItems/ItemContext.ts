import { ContextInstance, ContextParameters, DatabaseQuery, ParameterActions, TableNames } from '../types';
import { ContextMaker } from '../ItemContext';

export class ItemContextMaker<T extends object, TableName extends TableNames>
	implements ContextInstance<TableName>
{
	private parameters: ContextParameters<T>;
	constructor(private query: DatabaseQuery<TableName>) {
		this.parameters = {};
	}
	GetQuery() {
		return this.query;
	}

	SetParameters<T extends object>(parameters: ContextParameters<T> | undefined): this {
		if (!parameters) return this;
		//@ts-expect-error ts buggin isso eh mesmo tipo
		this.parameters = parameters;
		return this;
	}

	Build() {
		ContextMaker.setLimit(this.parameters, this.query);
		ContextMaker.setOrder(this.parameters, this.query);
		ContextMaker.setFullTextSearch(this.parameters, this.query);
		ContextMaker.setWhere(this.parameters.where, this.query);
		ContextMaker.setWhereIn(this.parameters, this.query);
		if (this.parameters.offset && this.parameters.offset > 0 && ParameterActions.LIMIT in this.parameters) {
			this.query.offset(this.parameters.offset);
		}

		if (this.parameters.select) {
			this.query.select(this.parameters.select);
		}

		return this.query as unknown as DatabaseQuery<TableName>;
	}
}
