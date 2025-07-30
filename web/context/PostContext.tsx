import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { usePosts } from '../hooks/usePosts';
import { Category, Post } from 'shared';
import { useCategories } from '../hooks/useCategories';
import { getData } from '../class/serverBridge';


type PostPreview = {
	images: { url: string }[]
}

type IPostContext = {
	post: Post;
	update: (post: Post) => void


	isCreator: boolean;
};

export const PostContext = createContext<IPostContext | null>(null);

export const PostProvider = ({ post, children }: { post: Post; children: any }) => {
	const allPosts = usePosts();
	const catContext = useCategories()




	function update(post: Post) {
		allPosts.UpdatePost(post)
	}


	return <PostContext.Provider value={{

		isCreator: true,
		post: post,
		update,


	}}>
		{children}
	</PostContext.Provider>
};


export function usePost() {
	const ctx = useContext(PostContext)

	if (!ctx) {
		throw new Error(`invalid post context`)
	}

	return ctx
}