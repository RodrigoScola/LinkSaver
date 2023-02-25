import axios from "../class/serverBridge"
import { FolderProvider } from "../context/FolderContext"
import { FolderCard } from "../Components/cards/folderCard"
import { Flex, Text } from "@chakra-ui/react"
import { Suspense, useCallback, useEffect } from "react"
import { useFolder } from "../hooks/useFolder"
import { RenderHead } from "../Components/RenderHead"

export default function FoldersPage() {
	const { folder, newFolder } = useFolder([])

	const go = useCallback(async () => {
		const folders = await (await axios.get("folders")).data
		if (folders) {
			folders.map((item) => newFolder(item))
		}
	}, [newFolder])

	useEffect(() => {
		go()
	}, [go])

	return (
		<>
			<RenderHead title={"Folders"} />
			<Flex wrap={"wrap"} justifyContent={"space-evenly"}>
				{folder.length > 0 &&
					folder?.map((folder, i) => {
						return (
							<Suspense key={"folder" + i} fallback={<Text>Loading</Text>}>
								<FolderProvider folder={folder}>
									<FolderCard />
								</FolderProvider>
							</Suspense>
						)
					})}
			</Flex>
		</>
	)
}
