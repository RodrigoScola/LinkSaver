import { createContext, useCallback, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useUsers } from "../hooks/useUser"
import { addPost, selectPosts } from "../store/post/PostSlice"

export const PostContext = createContext({ isCreator: false })

export const PostProvider = ({ post, children }) => {
	const [{ id }] = useUsers()
	const dispatch = useDispatch()
	const all_posts = useSelector(selectPosts)

	const currentPost = useMemo(() => {
		return all_posts.posts[post.id] || post
	}, [all_posts.posts])

	useEffect(() => {
		if (post.id !== currentPost.id) {
			dispatch(addPost({ post }))
		}
	}, [post, dispatch, currentPost])

	const updateCurrentPost = useCallback(
		(newInformation) => {
			if (newInformation) {
				const post = { ...currentPost, ...newInformation, id: currentPost.id }
				if (JSON.stringify(post) !== JSON.stringify(currentPost)) {
					dispatch(addPost({ post }))
				}
			}
		},
		[post, currentPost, dispatch]
	)

	return (
		<PostContext.Provider
			value={{
				get isCreator() {
					return currentPost.user_id == id
				},
				updatePost: updateCurrentPost,
				...currentPost,
			}}
		>
			{children}
		</PostContext.Provider>
	)
}
