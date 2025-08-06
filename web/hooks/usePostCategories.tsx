import { createContext, useContext, useState } from 'react';
import { Category, OmitBy, PostCategories } from 'shared';
import { getData } from '../class/serverBridge';
import assert from 'assert';

type IPostCategory = {
	GetPostCategories: (postId: number) => Promise<PostCategories[]>;
	AddPostCategory: (postCat: PostCategories) => void;
	RemovePostCategory: (postCat: PostCategories) => Promise<void>;
	CreatePostCategory: (postCat: OmitBy<PostCategories, 'id'>) => Promise<PostCategories | undefined>;
};

const PostCategoryContext = createContext<IPostCategory | null>(null);

export const PostCategoryProvider = ({ children }: { children: React.ReactNode }) => {
	const [postCategories, setPostCategories] = useState<Record<number, PostCategories[]>>({});

	async function GetPostCategories(postId: number): Promise<PostCategories[]> {
		// if (postId in postCategories && postCategories[postId]) {
		// 	return postCategories[postId];
		// }

		const cats = await getData.get(`/postCategories/?post_id=${postId}`);

		console.log('post categories for post', postId, cats);

		//shoot me like a dog
		setPostCategories((curr) => ({
			...curr,
			[postId]: [...(curr[postId] || []), ...(cats || [])],
		}));

		return cats;
	}

	async function RemovePostCategory(postCat: PostCategories) {
		console.log('sending');
		const removed = await getData.delete(`/postCategories/${postCat.id}`);

		if (!removed) {
			console.error('Failed to remove post category');
			return;
		}
	}

	async function CreatePostCategory(
		postCat: OmitBy<PostCategories, 'id'>
	): Promise<PostCategories | undefined> {
		const newpostCat = await getData.post(`/postCategories/`, postCat);

		if (!newpostCat) {
			return;
		}

		AddPostCategory(newpostCat);

		return newpostCat;
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
				CreatePostCategory,
				GetPostCategories,
				AddPostCategory,
				RemovePostCategory,
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
