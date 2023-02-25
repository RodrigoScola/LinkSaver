import { Flex, SimpleGrid } from "@chakra-ui/react"
import { FolderProvider } from "../../context/FolderContext"
import { FolderCard } from "../cards/folderCard"
export const RenderFolders = ({ folders, children, ...props }) => {
	return (
		<SimpleGrid {...props} minChildWidth={"100px"} spacingX={"100px"}>
			{folders?.map((folder, i) => {
				return (
					<FolderProvider key={"folderContext" + i} folder={folder}>
						<FolderCard />
					</FolderProvider>
				)
			})}
			{children}
		</SimpleGrid>
	)
}
