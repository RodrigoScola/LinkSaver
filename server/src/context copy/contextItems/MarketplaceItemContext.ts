import {
    ItemStatus,
    ItemTableFields,
    MARKETPLACES,
    TableNames,
} from 'wecubedigital';
import {
    ContextInstance,
    ContextParameters,
    ContextQuery,
} from '../../../types/contextTypes';
import { DatabaseQuery } from '../../../types/storageType';
import { ContextMaker } from '../ItemContext';

//todo: make an init function  for testing
export class MarketplaceContextMaker<T extends TableNames = TableNames>
    implements ContextInstance<T>
{
    ignoreWithStatus: ItemStatus[] = [];
    parameters: ContextParameters<ItemTableFields[T]>;
    private marketplaceId: MARKETPLACES;
    constructor(
        marketplaceId: MARKETPLACES,
        private query: ContextQuery<T>,
    ) {
        this.ignoreWithStatus = [];
        this.marketplaceId = marketplaceId;

        this.parameters = {};

        if (this.parameters.where) {
            this.parameters.where = Object.assign(this.parameters.where, {
                marketplaceId: marketplaceId,
            });
        }
        this.parameters.where = {};
    }
    SetIgnoreStatus(status: ItemStatus | ItemStatus[]) {
        if (Array.isArray(status)) {
            this.ignoreWithStatus = status;
        } else {
            this.ignoreWithStatus.push(status);
        }
        return this;
    }
    GetQuery(): DatabaseQuery<T> {
        return this.query as DatabaseQuery<T>;
    }
    GetMarketplace() {
        return this.marketplaceId;
    }
    SetMarketplace(marketplace: MARKETPLACES) {
        this.marketplaceId = marketplace;
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
        this.query.where('marketplaceId', this.marketplaceId);
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
