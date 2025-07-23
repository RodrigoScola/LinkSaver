import { ItemStatus, ItemTableFields, TableNames } from 'wecubedigital';
import {
    ContextInstance,
    ContextParameters,
} from '../../../types/contextTypes';
import { DatabaseQuery } from '../../../types/storageType';
import { ContextMaker } from '../ItemContext';

export class DatabaseContextMaker<T extends TableNames = TableNames>
    implements ContextInstance<T>
{
    ignoreWithStatus: ItemStatus[] = [];
    parameters: ContextParameters<ItemTableFields[T]>;
    constructor(private query: DatabaseQuery<T>) {
        this.ignoreWithStatus = [];

        this.parameters = {};
    }
    GetQuery(): DatabaseQuery<T> {
        return this.query as DatabaseQuery<T>;
    }
    SetParameters<T extends object>(parameters: ContextParameters<T>): this {
        //@ts-expect-error eu nao sei como fazer isso
        this.parameters = parameters;
        return this;
    }

    Build() {
        ContextMaker.setLimit(this.parameters, this.query as DatabaseQuery<T>);
        ContextMaker.setOrder(this.parameters, this.query as DatabaseQuery<T>);
        ContextMaker.setIgnoreStatus(
            this.query as DatabaseQuery<T>,
            this.ignoreWithStatus,
        );
        ContextMaker.setFullTextSearch(
            this.parameters,
            this.query as DatabaseQuery<T>,
        );
        ContextMaker.setWhere(
            this.parameters.where,
            this.query as DatabaseQuery<T>,
        );
        ContextMaker.setWhereIn(
            this.parameters,
            this.query as DatabaseQuery<T>,
        );

        if (this.parameters.offset && this.parameters.offset > 0) {
            this.query.offset(this.parameters.offset);
        }

        if (this.parameters.select) {
            this.query.select(this.parameters.select);
        }

        return this.query as unknown as DatabaseQuery<T>;
    }
}
