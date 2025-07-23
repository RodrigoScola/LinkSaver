import { Knex, knex } from 'knex';

declare module 'knex/types/tables' {
	interface Tables {
		posts: Post;
		categories: Category;
	}
}

// Global types
declare global {
	export type BaseQuery = knex.Knex<any, any[]>;

	/**
	 * Get all method keys of BaseQuery (functions only)
	 */
	export type FunctionKeys<T> = {
		[K in keyof T]: T[K] extends (...args: any) => any ? K : never;
	}[keyof T];

	export type QueryMethod = FunctionKeys<BaseQuery>;

	/**
	 * Base class for query types
	 */
	export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
	export type OmitBy<T, K extends keyof T> = Omit<T, K>;

	export type Post = {
		title: string;
		id: number;
		post_url: string;
		description: string;
		userId: number;
		parent?: number;
		post_type: POST_TYPE;
		created_at: string;
		updated_at: string;
	};

	export type Category = {
		id: number;
		name: params.name;
		color: string;
		status: string;
	};

	export type PostCategories = {
		id: number;
		category: number;
		postId: number;
	};
	export type NewPost = OmitBy<Post, 'id'>;
}

// Ensure this file is a module
export {};
