import { createContext, useCallback, useContext } from 'react';

import { useObject } from '../hooks/useObject';
import { newPost } from '../utils/formatting/utils';
import { Category, PartialBy, Post } from 'shared';
import { getData } from '../class/serverBridge';

type NewPost = PartialBy<Post, 'id'>;

export type NewPostContextType = {
	Post: () => NewPost;
	SubmitPost: () => Promise<Post>;
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
		return !hasError;
	}, [post.value]);

	function Update(postData: Partial<NewPost>) {
		post.update({ ...post.value, ...postData });
	}

	function SubmitPost(): Promise<Post> {
		return getData.post(`/posts`, post);
	}

	function GetErrors(): string[] {
		const errors: string[] = [];

		if (post.value.title == '') {
			errors.push('title cannot be empty');
		}
		if (Object.values(postCategories).length > 3) {
			errors.push('you cannot have more than 3 categories');
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
