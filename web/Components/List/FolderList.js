import { Box, Heading } from "@chakra-ui/react"
import { useContext } from "react"
import { FolderContext } from "../../context/FolderContext"
import { BASEURL } from "../../utils/formatting/utils"

export const FolderList = () => {
	const { folder } = useContext(FolderContext)

	return (
		<Box outline={"1px"} py={2}>
			<a href={`${BASEURL}/folders/${folder.id}`}>
				<Heading size={"xs"}>{folder.name}</Heading>
			</a>
		</Box>
	)
}
