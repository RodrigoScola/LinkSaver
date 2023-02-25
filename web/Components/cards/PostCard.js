import { useCallback, useContext, useEffect } from "react"
import { PostContext } from "../../context/PostContext"
import { Box, Button, ButtonGroup, Container, Divider, Flex, Heading, Img, Link, Skeleton } from "@chakra-ui/react"
import { LikeButton } from "../Buttons/LikeButton"
import { ModalComponent } from "../ui/modals/ModalComponent"
import { RenderCategories } from "../postTypes/RenderCategories"
import { useCategories } from "../../hooks/useCategories"
import { DeleteButton } from "../Buttons/DeleteButton"
import { updatePost as serverSavePost } from "../../store/post/PostSlice"
import { EditPostCard } from "./EditPostCard"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useFetch } from "../../hooks/useFetch"
import { VscEdit, VscSave, VscTrash } from "react-icons/vsc"
import formatter from "../../utils/formatting/formatting"
import { BoxCard } from "./BoxCard"

export const PostCard = () => {
	const { savePost, isCreator, updatePost, ...post } = useContext(PostContext)
	const { categories, setNewIds } = useCategories(post.categories)
	const dispatch = useDispatch()

	const [currPost, setCurrPost] = useState(post)
	const closeElement = () => {}
	const onChange = useCallback(
		(e) => {
			if (e) {
				const name = Object.keys(e)[0]
				const value = Object.values(e)[0]
				setCurrPost((curr) => ({ ...curr, [name]: value }))
			}
		},
		[setCurrPost]
	)
	const { data } = useFetch(`posts/${post.id}/?extended=true`)
	useEffect(() => {
		if (data) {
			updatePost(data)
		}
	}, [data, updatePost])

	const updatePo = () => {
		dispatch(serverSavePost(currPost))
	}
	return (
		<BoxCard height={"fit-content"} minW={"200px"} w={"30%"} p={3} maxW={"400px"}>
			<Box pb={2}>
				<Flex alignItems={"center"} justifyContent={"space-between"}>
					<Link href={post?.post_url ? post?.post_url : "#"}>
						<Heading wordBreak={"break-all"} size={"md"} textTransform={"capitalize"}>
							{post.title}
						</Heading>
					</Link>
				</Flex>
			</Box>
			<Box py={0}>
				{post?.preview?.images?.length > 0 && (
					<Flex pb={4} justifyContent={"center"}>
						<Container
							justifyContent={"center"}
							display={"flex"}
							border={"2px"}
							borderColor={"white"}
							// px={4}
						>
							<Img
								width={"full"}
								rounded={"2xl"}
								src={post?.preview?.images[0] || "#"}
								alt={`post image for the post ${post?.title}`}
							/>
						</Container>
					</Flex>
				)}

				<RenderCategories categories={Object.values(categories)} />
				<Divider borderWidth={"2px"} mt={3} />
			</Box>
			<Box display={"flex"} justifyContent={"right"}>
				<ButtonGroup>
					<LikeButton size={"sm"} />
					{isCreator ? (
						<>
							<ModalComponent
								color={"purple"}
								onClose={closeElement}
								footerElement={
									<Button colorScheme={"yellow"} leftIcon={<VscSave />} onClick={updatePo}>
										Save
									</Button>
								}
								triggerElement={
									<Button size={"sm"} shadow={formatter.color.shadows.right} variant={"outline"} colorScheme={"blue"}>
										<VscEdit />
									</Button>
								}
								headerText={"Edit post"}
							>
								<EditPostCard {...post} onChange={onChange} />
							</ModalComponent>
							<Skeleton borderRadius={"12px"} isLoaded={post.title}>
								<ModalComponent
									color={"red"}
									onClose={closeElement}
									footerElement={<DeleteButton />}
									triggerElement={
										<Button shadow={formatter.color.shadows.right} variant={"outline"} size={"sm"} colorScheme={"red"}>
											<VscTrash />
										</Button>
									}
									headerText={<Heading size={"xl"}>Are you sure you want to delete this?</Heading>}
								></ModalComponent>
							</Skeleton>
						</>
					) : null}
				</ButtonGroup>
			</Box>
		</BoxCard>
	)
}
