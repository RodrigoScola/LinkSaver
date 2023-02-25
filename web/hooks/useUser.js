import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addInfo, selectUser } from "../store/user/userSlice"

export const useUsers = () => {
	const dispatch = useDispatch()
	const selectInfo = useSelector(selectUser)?.data
	const currUserInfo = useMemo(() => {
		return { ...selectInfo }
	}, [selectInfo])

	const setCurrUser = useCallback(
		(info) => {
			dispatch(addInfo(info))
		},
		[dispatch]
	)
	return [
		{
			get loggedIn() {
				return currUserInfo.id !== null
			},
			...currUserInfo,
		},
		setCurrUser,
	]
}
