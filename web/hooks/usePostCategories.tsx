import { createContext, useContext, useState } from 'react';
import { Category, PostCategories } from 'shared';
import { getData } from '../class/serverBridge';
import assert from 'assert';

type IPostCategory = {
	GetPostCategories: (postId: number) => Promise<PostCategories[]>;
	AddPostCategory: (postCat: PostCategories) => void;
};

const PostCategoryContext = createContext<IPostCategory | null>(null);

export const PostCategoryProvider = ({ children }: { children: React.ReactNode }) => {
	const [postCategories, setPostCategories] = useState<Record<number, PostCategories[]>>({});

	async function GetPostCategories(postId: number): Promise<PostCategories[]> {
		if (postId in postCategories && postCategories[postId]) {
			return postCategories[postId];
		}

		const cats = (await getData.get(`/postCategories/?post_id=${postId}`)) || [];

		setPostCategories((curr) => ({ ...curr, [postId]: cats || [] }));

		return cats;
	}

	function AddPostCategory(postCat: PostCategories) {
		if (postCat.post_id in postCategories) {
			const updatedArray = postCategories[postCat.post_id];

			setPostCategories((curr) => ({ ...curr, [postCat.post_id]: updatedArray }));
			return;
		}

		setPostCategories((curr) => ({ ...curr, [postCat.post_id]: [postCat] }));
	}

	return (
		<PostCategoryContext.Provider
			value={{
				GetPostCategories,
				AddPostCategory,
			}}>
			{children}
		</PostCategoryContext.Provider>
	);
};

export function usePostCategory() {
	const ctx = useContext(PostCategoryContext);

	if (!ctx) {
		throw new Error(`invalid context`);
	}

	return ctx;
}
