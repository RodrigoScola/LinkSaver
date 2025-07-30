import { Flex, SimpleGrid, SimpleGridProps } from "@chakra-ui/react"
import { FolderProvider } from "../../context/FolderContext"
import { FolderCard } from "../cards/folderCard"
import { Folder } from 'shared'
import { ReactNode } from 'react'
type RenderFoldersProps = {
	folders: Folder[]
	children?: ReactNode
} & SimpleGridProps

export const RenderFolders = ({ folders, children, ...props }: RenderFoldersProps) => {

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
