import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addInteraction, addPostInteraction } from "../store/interactions/InteractionsSlice"
import { useUsers } from "./useUser"
const { getData } = require("../class/serverBridge")

export const useInteraction = (postId, type) => {
	const [{ id }] = useUsers()
	const allPosts = useSelector((state) => state.interactions.interactions)

	const postInteractions = useMemo(() => allPosts[postId], [allPosts])

	const dispatch = useDispatch()
	const go = async () => {
		try {
			const data = await getData.getData(`interactions/${postId}/${id}`)
			if (data[0]) {
				dispatch(addInteraction(...data))
			}
		} catch (err) {}
	}
	const addLike = async () => {
		try {
			const data = await getData.post(`interactions/${postId}/${id}/`, {
				type: "like",
			})
			dispatch(
				addInteraction({
					...data,
				})
			)
		} catch (err) {
			console.log(err)
		}
	}
	const interactions = useMemo(() => {
		return postInteractions
	}, [postInteractions])
	useEffect(() => {
		dispatch(addPostInteraction({ post_id: postId }))
	}, [])

	useEffect(() => {
		if (postId && interactions == null && id) {
			go()
		}
	}, [postId, id])

	return {
		get interactions() {
			return allPosts[postId]
		},
		addLike,
	}
}
