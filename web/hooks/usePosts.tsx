import { NewInteraction, PartialBy, Post, PostCategories } from 'shared';
import { createContext, useContext, useState } from 'react';
import _ from 'lodash';
import { getData } from '../class/serverBridge';

type IPostContext = {
	GetPostsByIds: (ids: number[]) => Promise<any>;
	GetPost: (id: number) => Promise<void>;
	UpdatePost: (post: Post) => Promise<void>;
	AddPost: (posts: Post) => void;

	PostPost: (post: PartialBy<Post, 'id'>) => Promise<void>;
	Posts: () => Record<number, Post>;

	// GetCategories: (postId: number) => Promise<PostCategories[]>;
};

const PostsContext = createContext<IPostContext | null>(null);

export const PostsProvider = ({ children }: { children: any }) => {
	const [posts, setPosts] = useState<Record<number, Post>>({});

	function GetPostsByIds(ids: number[]) {
		return Promise.allSettled(ids.map((id) => getData.get(`/posts/${id}`)));
	}
	async function GetPost(id: number) {
		const post = await getData.get(`/posts/${id}`);

		if (!('id' in post)) {
			console.error(`invalid post`, post);
			return;
		}

		AddPost(post);
	}

	async function CreatePost(post: PartialBy<Post, 'id'>) {
		const newPost = await getData.post('/posts', post);
		AddPost(newPost);
	}

	async function UpdatePost(post: Post) {
		const updated = await getData.update(`/posts/${post.id}`, post);

		if (!updated || typeof updated !== 'object' || !('id' in updated)) {
			console.error(`invalid post`, updated);
			return;
		}
		AddPost(updated as Post);
	}

	function AddPost(post: Post) {
		setPosts((curr) => ({ ...curr, [post.id]: post }));
	}

	// async function GetCategories(id: number) {
	// 	return id in postCategories
	// 		? Promise.resolve(postCategories[id])
	// 		: getData.get(`/posts/${id}/categories`);
	// }

	return (
		<PostsContext.Provider
			value={{
				UpdatePost,
				Posts: () => posts,
				AddPost,
				PostPost: CreatePost,
				GetPostsByIds,
				// GetCategories,
				GetPost,
			}}>
			{children}
		</PostsContext.Provider>
	);
};

export const usePosts = () => {
	const ctx = useContext(PostsContext);

	if (!ctx) {
		throw new Error('invalid Context for posts');
	}

	return ctx;
};
