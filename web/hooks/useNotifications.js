import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import {
	removeNotification,
	addNotification,
	newNotification,
	selectNotifications,
} from "../store/notifications/NotificationSlice"
import { useToast } from "@chakra-ui/react"
export const useNotifications = () => {
	const toast = useToast()
	const timers = useSelector(selectNotifications)
	const dispatch = useDispatch()
	const add = (
		options = { id: null, title: "", description: "", duration: 5000, status: "success", isClosable: true }
	) => {
		if (!Object.keys(timers).includes(toString(options.id))) dispatch(addNotification(newNotification(options)))
	}

	useEffect(() => {
		try {
			const latest = Object.values(timers)[Object.keys(timers).length - 1]
			// console.log(timers)
			if (latest.id) {
				if (!toast.isActive(latest.id)) {
					toast({ position: "top", ...latest })
				}
			}
			setTimeout(() => {
				toast.close(latest)
				remove(latest.id)
			}, latest.time)
		} catch (err) {}
	}, [timers])

	const remove = (id) => {
		dispatch(removeNotification(id))
	}
	return [timers, { add, remove }]
}
