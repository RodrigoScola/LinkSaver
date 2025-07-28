import { AvailableContextItems, ContextInstance, DatabaseQuery, SEARCH_MODE, TableNames } from './types';
import { ContextBuilder } from './ContextBuilder';
import { ItemContextMaker } from './contextItems/ItemContext';

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

type R = { [K in TableNames]?: (query: DatabaseQuery<K>) => ContextInstance<K> };

export class ContextFactory {
	static Builder = ContextBuilder;
	private static readonly items: R = {};

	static AddItem<K extends TableNames>(key: K, instance: (query: DatabaseQuery<K>) => ContextInstance<K>) {
		this.items[key] = instance as any;
	}

	static Make<T extends AvailableContextItems>(name: T) {
		if (!(name in ContextFactory.items)) throw new Error('Context item inot found' + name);
		return ContextFactory.items[name];
	}
	static fromRequest<T extends AvailableContextItems>(name: T, query: DatabaseQuery<T>): ContextInstance<T> {
		if (!(name in ContextFactory.items)) {
			throw new Error('Context item not found');
		}

		const factory = ContextFactory.items[name];

		if (!factory) {
			throw new Error(`invalid factory of ${name}`);
		}

		const item = factory(query);

		return item;
	}
}

ContextFactory.AddItem(
	'categories',
	(q: DatabaseQuery<'categories'>): ContextInstance<'categories'> =>
		new ItemContextMaker<Category, 'categories'>(
			q

				//we dont have anything that makes us available to see private in frontend yet
				.where('status', 'public')
		)
);

ContextFactory.AddItem(
	'posts',
	(q: DatabaseQuery<'posts'>): ContextInstance<'posts'> => new ItemContextMaker<Post, 'posts'>(q)
);

ContextFactory.AddItem(
	'folders',
	(q: DatabaseQuery<'folders'>): ContextInstance<'folders'> => new ItemContextMaker<Folder, 'folders'>(q)
);

ContextFactory.AddItem(
	'users',
	(q: DatabaseQuery<'users'>): ContextInstance<'users'> => new ItemContextMaker<User, 'users'>(q)
);
ContextFactory.AddItem(
	'post_categories',
	(q: DatabaseQuery<'post_categories'>): ContextInstance<'post_categories'> =>
		new ItemContextMaker<PostCategories, 'post_categories'>(q)
);

ContextFactory.AddItem(
	'interactions',
	(q: DatabaseQuery<'interactions'>): ContextInstance<'interactions'> =>
		new ItemContextMaker<Interaction, 'interactions'>(q)
);
