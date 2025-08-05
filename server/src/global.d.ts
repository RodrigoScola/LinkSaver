import { Post, Category, PostCategories, Folder, Interaction, User } from 'shared';
import { AsyncQueue } from './class/async';
import { Knex, knex } from 'knex';

declare module 'knex/types/tables' {
	interface Tables {
		posts: Post;
		categories: Category;
		post_categories: PostCategories;
		folders: Folder;
		interactions: Interaction;

		users: User;
	}
}

// Global types
declare global {
	namespace Express {
		export interface Request {
			queue: AsyncQueue;
		}
	}
}
