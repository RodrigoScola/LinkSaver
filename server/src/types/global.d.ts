// types/knex.d.ts

// Must be first so the module augmentation works correctly
import type { Knex } from 'knex';

declare module 'knex/types/tables' {
	interface Tables {}
}

// Global types
declare global {
	export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
	export type OmitBy<T, K extends keyof T> = Omit<T, K>;

	export enum POST_TYPE {
		Post = 1,
		Directory = 2,
	}

	export type Post = {
		title: string;
		id: number;
		post_url: string;
		description: 'string';
		userId: string;
		parent?: number;
		type: POST_TYPE;
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
