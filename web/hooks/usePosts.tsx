import { NewInteraction, Post, PostCategories } from 'shared'
import { createContext, useContext, useState } from 'react';
import _ from 'lodash';
import { getData } from '../class/serverBridge';


type IPostContext = {
	GetPostsByIds: (ids: number[]) => Promise<any>,
	GetPost: (id: number) => Promise<void>
	UpdatePost: (post: Post) => Promise<void>
	AddPost: (posts: Post) => void
	AddLike: (postId: number, userId: number) => Promise<void>
	Posts: () => Record<number, Post>

	GetCategories: (postId: number) => Promise<PostCategories[]>
}





const PostsContext = createContext<IPostContext | null>(null);

export const PostsProvider = ({ children }: { children: any }) => {
	const [posts, setPosts] = useState<Record<number, Post>>({});

	const [postCategories, setPostsCategories] = useState<Record<number, PostCategories[]>>([])


	function GetPostsByIds(ids: number[]) {
		return Promise.allSettled(ids.map(id => getData.getData(`/posts/${id}`)))
	}
	async function GetPost(id: number) {
		const post = await getData.getData(`/posts/${id}`)

		if (!('id' in post)) {
			console.error(`invalid post`, post)
			return;
		}

		AddPost(post)
	}

	async function UpdatePost(post: Post) {
		const updated = await getData.update('posts', post.id, post)
		AddPost(updated)
	}



	function AddPost(post: Post) {
		setPosts(curr => ({ ...curr, [post.id]: post }))
	}

	async function AddLike(postId: number, userId: number) {
		//todo: make an interactions thing
		await getData.post('interactions', { postId: postId, status: 'public', userId, type: 'like' } as NewInteraction)
		//TODO: update the interactions
	}

	async function GetCategories(id: number) {
		return id in postCategories ? Promise.resolve(postCategories[id]) : getData.getData(`/posts/${id}/categories`)
	}





	return <PostsContext.Provider value={{
		UpdatePost,
		Posts: () => posts,
		AddLike,
		AddPost,
		GetPostsByIds,
		GetCategories,
		GetPost

	}}>{children}</PostsContext.Provider>;
};




export const usePosts = () => {

	const ctx = useContext(PostsContext)

	if (!ctx) {
		throw new Error("invalid Context for posts")
	}

	return ctx
};
