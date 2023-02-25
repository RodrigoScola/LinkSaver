import { Box, Flex, Heading, IconButton } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react"
import { FolderContext } from "../../context/FolderContext"
import { NewFolder } from "../forms/NewFolder"
import { PopoverElement } from "../ui/popover/PopoverElement"
import { useDispatch } from "react-redux"
import { updateFolder } from "../../store/folder/FolderSlice"
import { EditIcon } from "@chakra-ui/icons"
import { color } from "../../utils/formatting/ColorFormat"
import { useRouter } from "next/router"

export const FolderCard = () => {
	const router = useRouter()
	const { folder, isCreator } = useContext(FolderContext)
	const [hovering, setHovering] = useState(false)
	const [info, setInfo] = useState({
		name: "",
		color: "",
	})
	useEffect(() => {
		if (folder) {
			setInfo(folder)
		}
	}, [folder])
	const dispatch = useDispatch()
	const handleUpdate = useCallback(() => {
		dispatch(updateFolder({ ...info, id: folder.id }))
	}, [dispatch])
	useEffect(() => {
		if (hovering) {
			console.log(color.lighten(folder?.color, 15))
		}
	}, [hovering, folder.color])

	const handleChange = useCallback(
		(item) => {
			setInfo(item)
		},
		[setInfo]
	)
	const onClick = () => {
		router.push(`/folders/${folder?.id}`)
	}
	return (
		<Flex
			onClick={onClick}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			position={"relative"}
			shadow={`-5px 5px ${folder?.color} `}
			flexDir={"column"}
			alignItems={"center"}
			justifyContent={"center"}
			maxW={"300px"}
			p={2}
			color={folder?.color}
			border={"2px"}
			borderRadius={"10px"}
			minHeight={"100px"}
			minW={"105px"}
		>
			<a href={"/folders/" + folder?.id}>
				<Heading overflowWrap={"anywhere"} size={"lg"}>
					{folder?.name}
				</Heading>
			</a>
			{hovering && isCreator ? (
				<Box position={"absolute"} top={0} right={"0"}>
					<PopoverElement triggerElement={<IconButton icon={<EditIcon />} />}>
						<NewFolder onChange={handleChange} handleSubmit={handleUpdate} name={folder?.name} color={folder?.color} />
					</PopoverElement>
				</Box>
			) : null}
		</Flex>
	)
}
