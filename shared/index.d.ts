import { AsyncQueue } from '../class/async';
import { Knex, knex } from 'knex';

export type PostInteraction = {
	like: number;
};

export type Interaction = {
	id: number;
	type: 'like';
	userId: number;
	postId: number;
	status: 'public' | 'private';
	created_at: string;
	updated_at: string;
};

export type NewInteraction = OmitBy<Interaction, 'id' | 'created_at' | 'updated_at'>;

export type BaseQuery = knex.Knex<any, any[]>;

/**
 * Get all method keys of BaseQuery (functions only)
 */
export type FunctionKeys<T> = {
	[K in keyof T]: T[K] extends (...args: any) => any ? K : never;
}[keyof T];

export type QueryMethod = FunctionKeys<BaseQuery>;

export type Folder = {
	title: string;
	id: number;
	color: string;
	description: string;
	userId: number;
	parent_folder: number;
	status: 'public' | 'private';
	created_at: string;
	updated_at: string;
};

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
	status: 'public' | 'private';
	created_at: string;
	updated_at: string;
};

export type User = {
	id: number;
	google_id: string;
	image_url?: string;
	isLive: boolean;

	status: 'public' | 'private';
};

export type Category = {
	id: number;
	name: params.name;

	userId: number;

	color: string;
	status: 'public' | 'private';
};

export type PostCategories = {
	id: number;
	category_id: number;
	post_id: number;
	userId: number;
	status: 'public' | 'private';
};
export type NewPost = OmitBy<Post, 'id'>;
// Ensure this file is a module
export {};
