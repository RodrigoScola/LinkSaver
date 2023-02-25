import { createContext, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useFolder } from "../hooks/useFolder"
import { useUsers } from "../hooks/useUser"
import { getFolder, selectFolder } from "../store/folder/FolderSlice"
import stringFormatting from "../utils/formatting/formatting"

export const FolderContext = createContext({ isCreator: false })

export const FolderProvider = ({ folder, children }) => {
	const [user] = useUsers()
	const [currentFolder, setCurrentFolder] = useState({
		id: -1,
		name: "",
		initials: "",

		posts: [],
	})
	const dispatch = useDispatch()
	const allFolders = useSelector(selectFolder)
	const { newFolder } = useFolder([])
	useEffect(() => {
		const initials = stringFormatting.initials(folder?.name, {
			letterCount: 12,
		})
		setCurrentFolder({ ...folder, initials })

		if (folder.parent_folder) {
			newFolder(folder.parent_folder)
		}
	}, [])

	const nfolder = useMemo(() => {
		return { ...currentFolder, ...folder }
	}, [folder, currentFolder])

	const isCreator = useMemo(() => {
		return true
		// return user.id == nfolder.user_id
	}, [user, nfolder])

	useEffect(() => {
		if (nfolder.parent_folder) {
			if (!allFolders[nfolder.parent_folder]) {
				dispatch(getFolder(nfolder.parent_folder))
			}
		}
	}, [nfolder])

	const parent_folder = useMemo(() => {
		return allFolders[nfolder.parent_folder]
	}, [folder, currentFolder, allFolders])

	return (
		<FolderContext.Provider
			value={{
				isCreator,
				folder: nfolder,
				parent_folder,
			}}
		>
			{children}
		</FolderContext.Provider>
	)
}
