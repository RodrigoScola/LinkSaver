import { createContext, useCallback, useContext } from 'react';

import { useObject } from '../hooks/useObject';
import { newPost } from '../utils/formatting/utils';
import { Category, PartialBy, Post } from 'shared';
import { getData } from '../class/serverBridge';

type NewPost = PartialBy<Post, 'id'>;

export type NewPostContextType = {
	Post: () => NewPost;
	SubmitPost: (post: NewPost) => Promise<Post | undefined>;
	CanSubmit: () => boolean;
	GetErrors: (newPost: NewPost) => string[];
	SetCategories: (categories: Category[]) => void;
	Update(post: Partial<NewPost>): void;
};

export const NewPostContext = createContext<NewPostContextType | null>(null);

export const NewPostProvider = ({ children }: { children: React.ReactNode }) => {
	const post = useObject<NewPost>(newPost());

	const postCategories = useObject<Record<number, Category>>({});

	const CanSubmit = useCallback(() => {
		let hasError = false;
		if (post.value.title == '') {
			hasError = true;
		}

		return !hasError && GetErrors(post.value).length === 0;
	}, [post.value]);

	const Update = useCallback(
		(postData: Partial<NewPost>) => {
			post.update(postData);
		},
		[post.update]
	);

	async function SubmitPost(newPost: NewPost): Promise<Post | undefined> {
		const copy = { ...newPost };

		delete copy.id;

		const createdpost = await getData.post(`/posts`, copy);

		return !createdpost.id ? undefined : createdpost;
	}

	function GetErrors(newPost: NewPost): string[] {
		const errors: string[] = [];

		if (newPost.title == '') {
			errors.push('title cannot be empty');
		}
		if (Object.values(postCategories).length > 3) {
			errors.push('you cannot have more than 3 categories');
		}

		try {
			if (post.value.post_url.length > 3) {
				new URL(post.value.post_url);
			}
		} catch (err) {
			errors.push(`Post url needs to be a valid url`);
		}
		return errors;
	}

	const SetCategories = useCallback((categories: Category[]) => {
		postCategories.update(
			categories.reduce((acc: Record<number, Category>, cat) => {
				acc[cat.id] = cat;
				return acc;
			}, {})
		);
	}, []);

	return (
		<NewPostContext.Provider
			value={{
				Post: () => post.value,

				SubmitPost,
				Update,

				GetErrors,
				CanSubmit,
				SetCategories,
			}}>
			{children}
		</NewPostContext.Provider>
	);
};

export function useNewPost() {
	const ctx = useContext(NewPostContext);

	if (!ctx) {
		throw new Error('useNewPost must be used within a NewPostProvider');
	}

	return ctx;
}
