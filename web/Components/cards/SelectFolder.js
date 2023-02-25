import { Box, Heading, Button, Text, Flex } from "@chakra-ui/react"
import { NewFolder } from "../forms/NewFolder"
import { PopoverElement } from "../ui/popover/PopoverElement"
import { FolderListInput } from "../List/FolderListInput"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SearchInput } from "../inputs/SearchInput"
import { useFolder } from "../../hooks/useFolder"
import { useFetch } from "../../hooks/useFetch"
import { useDispatch } from "react-redux"
import { submitFolder, updateData } from "../../store/newPost/newPostSlice"
import formatter from "../../utils/formatting/formatting"
import { useUsers } from "../../hooks/useUser"

export const SelectFolder = ({ baseFolders, onChange = () => {} }) => {
	const [user] = useUsers()
	const [selectedFolder, setSelectedFolder] = useState(null)
	const { folder: recentFolders, newFolder: setNewFolders, size } = useFolder(baseFolders)
	const { folder: folderResult, newFolder: newFolderResult } = useFolder([])
	const dispatch = useDispatch()
	const { data, setUrl } = useFetch("")
	const handleChange = useCallback(
		(item) => {
			onChange(item)
		},
		[onChange]
	)
	const handleSubmit = () => {
		dispatch(
			updateData({
				type: "folder",
				user_id: user.id,
			})
		)
		dispatch(submitFolder())
	}
	const handleResults = useCallback(
		(res) => {
			res.forEach((folder) => newFolderResult(folder))
		},
		[newFolderResult]
	)
	useEffect(() => {
		if (recentFolders.length == 0) {
			setUrl("folders/?user_id=" + user.id + "&count=4")
		}
	}, [setUrl, recentFolders, user.id])

	useEffect(() => {
		if (data && recentFolders.length == 0) {
			data.forEach((folder) => {
				setNewFolders(folder)
			})
		}
	}, [data, recentFolders, setNewFolders])

	return (
		<Box width={"100%"}>
			<Heading size={"md"}>Recent</Heading>
			<FolderListInput
				onChange={handleChange}
				selected={selectedFolder}
				width={"max-content"}
				folders={recentFolders}
			/>
			<SearchInput onResult={handleResults} type={"folders"} name={"folderSearchResult"} />
			{folderResult.map((folder, index) => {
				return (
					<Button
						onClick={() => {
							setNewFolders(folder)
							setSelectedFolder(folder)
						}}
						key={"folderResult_" + index}
					>
						{folder.name}
					</Button>
				)
			})}

			<PopoverElement
				onOpen={() => setSelectedFolder(null)}
				style={{
					// marginRight: "1em",
					width: "fit-content",
				}}
				headerElement={<Heading size={"md"}>New Folder</Heading>}
				triggerStyle={{
					width: "full",
					display: "flex",
					justifyContent: "center",
				}}
				triggerElement={
					<Flex width={"fit-content"} justifyContent={"center"}>
						<Button colorScheme={"yellow"} shadow={formatter.color.shadows.left} mt={4} value="new">
							Create new Folder
						</Button>
					</Flex>
				}
			>
				<NewFolder handleSubmit={handleSubmit} onSubmit={(folder) => setNewFolders(folder)} />
			</PopoverElement>
		</Box>
	)
}
