import { useEffect, useMemo, useState } from "react"
import { useDelay } from "../../hooks/useDelay"
import { useDispatch, useSelector } from "react-redux"
import { selectNewFolder, updateData } from "../../store/newPost/newPostSlice"
import { newFolder } from "../../utils/formatting/utils"
import { NewFolderCard } from "../cards/newFolderCard"
import { getFolder, selectFolder } from "../../store/folder/FolderSlice"

export const NewFolder = ({
	onSubmit = () => {},
	name = "",
	color = "",
	parent_folder = null,
	handleSubmit = () => {},
	onChange = () => {},
}) => {
	const { fn: setNewFolderColor } = useDelay((e) => updateinfo(e), 50)
	const [info, setInfo] = useState({})
	const folderInfo = useSelector(selectNewFolder)
	const dispatch = useDispatch()
	const allFolders = useSelector(selectFolder)
	const folder = useMemo(() => {
		if (folderInfo.data) {
			onSubmit(newFolder(folderInfo.data))
		}
	}, [folderInfo, onSubmit])

	const updateinfo = (e) => {
		setInfo((curr) => ({ ...curr, [e.target.name]: e.target.value }))
		onChange({ [e.target.name]: e.target.value })
		dispatch(
			updateData({
				type: "folder",
				[e.target.name]: e.target.value,
			})
		)
	}

	useEffect(() => {
		if (name) {
			dispatch(
				updateData({
					type: "folder",
					name,
				})
			)
		}
		if (color) {
			dispatch(updateData({ type: "folder", color }))
		}
		if (parent_folder) dispatch(updateData({ type: "folder", parent_folder }))
	}, [color, dispatch, name, parent_folder])

	useEffect(() => {
		if (folderInfo.parent_folder) {
			if (!allFolders[folderInfo.parent_folder]) {
				dispatch(getFolder(folderInfo.parent_folder))
			}
		}
	}, [dispatch, allFolders, folderInfo])

	return (
		<NewFolderCard
			handleSubmit={handleSubmit}
			onChange={setNewFolderColor}
			name={folderInfo.name}
			color={folderInfo?.color}
			parent_folder={folderInfo.parent_folder}
		/>
	)
}
