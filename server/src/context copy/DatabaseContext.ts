import { AvailableContextItems, ContextInstance, DatabaseQuery, SEARCH_MODE, TableNames } from './types';
import { ContextBuilder } from './ContextBuilder';
import { ItemContextMaker } from './contextItems/ItemContext';
import { MarketplaceContextMaker } from './contextItems/MarketplaceItemContext';
import { PrivateItemContextMaker } from './contextItems/PrivateItemContext';
import { DatabaseContextMaker } from './contextItems/DatabaseItemContext';

export function GetSearchModeMessage(mode: SEARCH_MODE) {
	switch (mode) {
		case SEARCH_MODE.BOOLEAN_MODE:
			return 'in boolean mode';

		case SEARCH_MODE.WITH_QUERY_EXPANSION:
			return 'with query expansion';

		case SEARCH_MODE.NATURAL_LANGUAGE:
			return 'in natural language mode';

		case SEARCH_MODE.NATURAL_LANGUAGE_WITH_QUERY:
			return 'in natural language mode with query expansion';

		default:
			throw new Error('Invalid Mode');
	}
}

export class ContextFactory {
	static Builder = ContextBuilder;
	private static readonly items = {
		attachments: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'attachments'>) =>
			new MarketplaceContextMaker<'attachments'>(marketplaceId, contextQuery),

		marketplaces: (__: unknown, query: DatabaseQuery<'marketplaces'>) => new ItemContextMaker(query),

		brands: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'brands'>) =>
			new MarketplaceContextMaker<'brands'>(marketplaceId, contextQuery),
		brand_context: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'brand_context'>) =>
			new MarketplaceContextMaker<'brand_context'>(marketplaceId, contextQuery),

		sku_price: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'sku_price'>) =>
			new MarketplaceContextMaker<'sku_price'>(marketplaceId, contextQuery),
		sku_inventory: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'sku_inventory'>) =>
			new MarketplaceContextMaker<'sku_inventory'>(marketplaceId, contextQuery),
		sku_attachment: (
			marketplaceId: MARKETPLACES,
			contextQuery: DatabaseQuery<'sku_attachment'>
			//@ts-expect-error idk
		) => new MarketplaceContextMaker(marketplaceId, contextQuery),
		sku_file: (
			marketplaceId: MARKETPLACES,
			contextQuery: DatabaseQuery<'sku_attachment'>
			//@ts-expect-error idk
		) => new MarketplaceContextMaker(marketplaceId, contextQuery),

		sku_kit: (
			marketplaceId: MARKETPLACES,
			contextQuery: DatabaseQuery<'sku_kit'>
			//@ts-expect-error idk
		) => new MarketplaceContextMaker(marketplaceId, contextQuery),

		ads: (contextQuery: ContextQuery<'ads'>) =>
			new PrivateItemContextMaker<'ads'>().init({
				name: 'ads',
				query: contextQuery,
			}),

		ad_approval: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'categories'>) =>
			new MarketplaceContextMaker<'categories'>(marketplaceId, contextQuery),
		product_ads: (__: unknown, query: DatabaseQuery<'product_ads'>) => new DatabaseContextMaker(query),
		banner_ads: (__: unknown, query: DatabaseQuery<'banner_ads'>) => new DatabaseContextMaker(query),

		roles: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'roles'>) =>
			new MarketplaceContextMaker<'roles'>(marketplaceId, contextQuery),

		products: (contextQuery: ContextQuery<'products'>) =>
			new PrivateItemContextMaker<'products'>().init({
				name: 'products',
				query: contextQuery,
			}),
		domains: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'brands'>) =>
			new MarketplaceContextMaker<'brands'>(marketplaceId, contextQuery),

		campaigns: (contextQuery: ContextQuery<'campaigns'>) =>
			new PrivateItemContextMaker<'campaigns'>().init({
				name: 'campaigns',
				query: contextQuery,
			}),

		sku: (contextQuery: ContextQuery<'sku'>) =>
			new PrivateItemContextMaker<'sku'>().init({
				name: 'sku',
				query: contextQuery,
			}),
		orders: (contextQuery: ContextQuery<'orders'>) =>
			new PrivateItemContextMaker<'orders'>().init({
				name: 'orders',
				query: contextQuery,
			}),

		credentials: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'credentials'>) =>
			new MarketplaceContextMaker<'credentials'>(marketplaceId, contextQuery),
		categories: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'categories'>) =>
			new MarketplaceContextMaker<'categories'>(marketplaceId, contextQuery),

		category_specification: (
			marketplaceId: MARKETPLACES,
			contextQuery: ContextQuery<'category_specification'>
		) => new MarketplaceContextMaker<'category_specification'>(marketplaceId, contextQuery),

		sellers: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'sellers'>) =>
			new MarketplaceContextMaker<'sellers'>(marketplaceId, contextQuery),

		seller_funds_history: (contextQuery: ContextQuery<'seller_funds_history'>) =>
			new PrivateItemContextMaker<'seller_funds_history'>().init({
				name: 'seller_funds_history',
				query: contextQuery,
			}),
		shelf: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'shelf'>) =>
			new MarketplaceContextMaker<'shelf'>(marketplaceId, contextQuery),
		banner_sizes: (marketplaceId: MARKETPLACES, contextQuery: ContextQuery<'banner_sizes'>) =>
			new MarketplaceContextMaker<'banner_sizes'>(marketplaceId, contextQuery),
	} as const satisfies Partial<Record<TableNames, unknown>>;

	static Make<T extends AvailableContextItems>(name: T) {
		if (!(name in ContextFactory.items)) throw new Error('Context item inot found' + name);
		return ContextFactory.items[name];
	}
	static fromRequest<T extends AvailableContextItems>(
		name: T,
		query: DatabaseQuery<T>,
		request: { user: UserInstance }
	): ContextInstance<T> {
		if (!(name in ContextFactory.items)) {
			throw new Error('Context item not found');
		}

		if (request.user.type && request.user.type === 'api') {
			return new ItemContextMaker(query);
		}

		const item = ContextFactory.items[name](
			//@ts-expect-error change this interface. make an init function
			request.user.marketplaceId,
			query
		);

		if (item instanceof PrivateItemContextMaker && PrivateItemContextMaker.IsContextName(name)) {
			//@ts-expect-error it is right
			item.init({ name, query })
				.SetMarketplace(request.user.marketplaceId)
				.SetSeller(request.user.sellerId)
				.SetIgoreStatus(request.user.getIngoreStatus());
		} else if (item instanceof ItemContextMaker) {
			item.SetIgnoreStatus(request.user.getIngoreStatus());
			item.GetQuery().where('id', request.user.marketplaceId);
		} else if (item instanceof MarketplaceContextMaker) {
			item.SetMarketplace(request.user.marketplaceId);
		}

		//@ts-expect-error it is right
		return item;
	}
}
