import { Tooltip } from "@chakra-ui/react"
import { IconButton } from "@chakra-ui/react"
import { CheckIcon } from "@chakra-ui/icons"
import { useContext } from "react"
import { PostContext } from "../../context/PostContext"
import { useInteraction } from "../../hooks/useInteraction"
import { color } from "../../utils/formatting/ColorFormat"
import { useUsers } from "../../hooks/useUser"
export const LikeButton = ({ isDisabled = true, testing = false, ...props }) => {
	const post = useContext(PostContext)
	const [{ loggedIn }] = useUsers()
	const { interactions, addLike } = useInteraction(post.id)
	const nlike = async () => {
		await addLike()
	}

	if (typeof interactions?.like?.id == "number") {
		return (
			<Tooltip label={testing && "you need to be logged in to use me"}>
				<IconButton
					isDisabled={loggedIn == false && isDisabled}
					onClick={nlike}
					shadow={color.shadows.left}
					backgroundColor={"yellow.200"}
					variant={"outline"}
					icon={<CheckIcon textShadow={"2px 2px #fff"} _hover={{ color: "yellow.200" }} color={"white"} />}
					colorScheme={"yellow"}
					{...props}
				/>
			</Tooltip>
		)
	}
	return (
		<>
			<Tooltip borderRadius={"xl"} label={loggedIn == false && "You need to be logged in to like this post"}>
				<IconButton
					isDisabled={loggedIn == false && isDisabled}
					onClick={nlike}
					shadow={color.shadows.right}
					variant={"outline"}
					icon={<CheckIcon />}
					colorScheme={typeof interactions?.like?.id == "number" ? "yellow" : "green"}
					{...props}
				/>
			</Tooltip>
		</>
	)
}
