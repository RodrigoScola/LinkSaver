import { categoryTable } from '../../datbase/CategoryTable.js';
import { EqualQueryType } from '../../datbase/Query.js';
import { userstable } from '../../datbase/UsersTable.js';
import { supabase } from '../../datbase/Table.js';

export class Post {
	constructor(postId, postData) {
		this.id = postId;
		this.title = postData?.title;
		this.categories = postData.categories;
		this.userId = postData?.user_id;
		this.created_at = new Date(postData.created_at);
		this.has_interaction = {};
		this.post_url = postData?.post_url ? postData.post_url : '';
		this.type = 'posts';
		this.extended = {};
	}

	async get_categories() {
		try {
			if (!this.categories) return [];
			const categories = await categoryTable.get_by_id(this?.categories);
			return categories;
		} catch (err) {
			return [];
		}
	}
	async init(user = true, categories = true, extended = false) {
		if (user) {
			await this.get_user();
		}
		if (categories == true) {
			await this.get_categories();
		}
		if (extended == true) {
			await this.getExtended();
		}
		return this;
	}
	async getExtended() {
		const post = await supabase
			.from('posts')
			.select('likes, preview')
			.where('id', this.id)
			.first();

		this.extended = data || {};
	}
	async get_user() {
		let user = null;
		if (this.userId) {
			user = await userstable.get_by_id(this.userId, [new EqualQueryType('user_id', this.userId)]);
		}
		return user;
	}

	/** @param {Partial<NewPost>} options
	 * @returns {NewPost}
	 */
	static New(options) {
		return {
			title: options.title ?? '',
			post_url: options?.post_url ?? '',
			id: options.id ?? -1,
			folder: options.folder ?? -1,
			categories: options.categories || [],
			userId: options.userId || '',
		};
	}
}
