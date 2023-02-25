import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addPost, getPost } from "../store/post/PostSlice"
import _ from "lodash"

export const usePosts = (initialPosts = []) => {
	const [postIds, setPostIds] = useState([])
	const currentPosts = useSelector((state) => state.post)
	const pids = useMemo(() => postIds, [postIds])
	const setIds = useCallback(
		(id) => {
			if (!postIds.includes(id)) {
				setPostIds([...pids, id])
			}
		},
		[pids, setPostIds]
	)
	const dispatch = useDispatch()

	const posts = useMemo(() => {
		return _.uniqBy(
			postIds
				.map((id) => {
					const post = currentPosts.posts[id]
					// console.log(post)

					if (post) {
						return post
					}
				})
				.filter((item) => item),
			"id"
		)
	}, [postIds, currentPosts])
	const newPost = useCallback(
		(post) => {
			if (post) {
				if (Number(post) && !currentPosts[post].id) {
					dispatch(getPost(post))
					setIds(post)
				} else if (!currentPosts[post.id]) {
					// dispatch(add_categories(post.categories))
					setIds(post.id)
					dispatch(addPost({ post }))
				}
			}
		},
		[setIds, dispatch]
	)

	useEffect(() => {
		if (initialPosts.length > 0) {
			const ids = []

			initialPosts.forEach((post) => {
				if (typeof post == "number") {
					ids.push(post)
				} else {
					newPost(post)
				}
			})
			// dispatch(getPosts(ids))
		}
	}, [initialPosts, newPost])
	const n = useCallback((post) => newPost(post), [newPost])
	return {
		posts,
		newPost: n,
	}
}
