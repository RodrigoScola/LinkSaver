import { Box, Img, Link, Flex } from "@chakra-ui/react"
import { useContext } from "react"
import { PostContext } from "../../context/PostContext"

export const PostList = () => {
	const post = useContext(PostContext)
	return (
		<Flex flexDir={"row"} gap={3}>
			{post?.preview?.images[0] && <Img src={post.preview.images[0]} />}
			<Link href={post.url !== "" ? post.url : "#"}>{post.title}</Link>
		</Flex>
	)
}
