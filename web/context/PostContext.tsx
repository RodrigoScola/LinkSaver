import { createContext, useCallback, useContext } from 'react';
import { usePosts } from '../hooks/usePosts';
import { Post } from 'shared';
import { useObject } from '../hooks/useObject';

type PostPreview = {
	images: { url: string }[];
};

type IPostContext = {
	post: Post;
	save: (post: Post) => void;
	isCreator: (userId: number) => boolean;
	preview: PostPreview;
};

export const PostContext = createContext<IPostContext | null>(null);

export const PostProvider = ({ post, children }: { post: Post; children: any }) => {
	const allPosts = usePosts();

	const preview = useObject<PostPreview>({ images: [] });

	const update = useCallback(
		(post: Post) => {
			allPosts.UpdatePost(post);
		},
		[allPosts.UpdatePost]
	);

	return (
		<PostContext.Provider
			value={{
				isCreator: (userId: number) => {
					return Number(post.userId) == Number(userId);
				},
				post: post,
				save: update,
				preview: preview.value,
			}}>
			{children}
		</PostContext.Provider>
	);
};

export function usePost() {
	const ctx = useContext(PostContext);

	if (!ctx) {
		throw new Error(`invalid post context`);
	}

	return ctx;
}
