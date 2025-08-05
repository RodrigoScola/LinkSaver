import { Category, Folder, Interaction, Post } from 'shared';
import formatter from './formatting';
export const BASEURL =
	process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://overflowsaver.vercel.app';

export const isDifferent = (a: any[], b: any[]) => {
	return JSON.stringify(a) != JSON.stringify(b);
};
export const newPost = (options?: Partial<Post>): Post => {
	return {
		...options,
		description: options?.description || '',
		status: options?.status || 'public',
		title: options?.title || '',
		post_url:
			formatter.url.isValid(options?.post_url || '') == true && options?.post_url
				? options?.post_url
				: '',
		id: options?.id || -1,
		parent: options?.parent || -1,
		userId: options?.userId || -1,
		created_at: '',
		updated_at: '',
	};
};
export const newCategory = (options: Partial<Category>): Category => {
	return {
		...options,
		status: 'public',
		userId: options?.userId || -1,
		id: options?.id || -1,
		name: options?.name || options?.name || '',
		color: options?.color || options?.color || '#000000',
	};
};
export const newFolder = (options?: Partial<Folder>): Folder => {
	return {
		...options,
		title: options?.title || '',
		id: options?.id || -1,
		parent_folder: options?.parent_folder || 0,
		color: options?.color || '#000000',
		description: options?.description || '',
		userId: options?.userId || -1,
		created_at: options?.created_at || '',
		updated_at: options?.updated_at || '',
		status: options?.status || 'public',
	};
};
export const newInteraction = (options: Partial<Interaction>): Interaction => {
	return {
		type: options?.type || 'like',
		id: options?.id || -1,
		created_at: options?.created_at || '',
		postId: options?.postId || -1,
		userId: options?.userId || -1,
		updated_at: options?.updated_at || '',
		status: options?.status || 'public',
	};
};

export const loopAsync = async (
	obj: { [x: string]: any },
	callable: { (id: any): Promise<any>; (id: any): Promise<any>; (arg0: any): any }
) => {
	if (!Array.isArray(obj)) {
		const returned = await callable(obj);

		if (typeof returned !== 'undefined') {
			obj = returned;
		}
		return obj;
	}
	const nobj = [];
	for (const i in obj) {
		const currObj = obj[i];
		const returned = callable(currObj);

		if (typeof returned !== 'undefined') {
			nobj.push(returned);
		}
	}
	const res = Promise.all(nobj);
	return res;
};
