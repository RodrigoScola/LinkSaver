import { Flex } from "@chakra-ui/react"
import { BoxCardOutline } from "../Components/cards/BoxCardOutline"
import { Box, Grid, Heading } from "@chakra-ui/react"
import { usePosts } from "../hooks/usePosts"
import { useFolder } from "../hooks/useFolder"
import { useEffect } from "react"
import { useUsers } from "../hooks/useUser"
import { BoxCard } from "../Components/cards/BoxCard"
import { useFetch } from "../hooks/useFetch"
import { RenderHead } from "../Components/RenderHead"
import { getData } from "../class/serverBridge"
import { PostProvider } from "../context/PostContext"

import dynamic from "next/dynamic"
import { supabase } from "../lib/supabaseClient"
const PostCard = dynamic(() => import("../Components/cards/PostCard").then((r) => r.PostCard))
const RenderFolders = dynamic(() => import("../Components/postTypes/renderFolders").then((r) => r.RenderFolders))

export default function Home({ popularPosts: basePosts }) {
	const [user] = useUsers()
	const { data: folderData, setUrl: setFolderUrl } = useFetch("")
	const isLoggedIn = user.id ? true : false
	const { folder, newFolder } = useFolder([])
	const { data, setUrl } = useFetch("")
	const { posts, newPost } = usePosts([])
	const { posts: popularPosts, newPost: newPopularPost } = usePosts([])

	console.log(user.id)

	useEffect(() => {
		if (isLoggedIn) {
			setUrl("posts/?user_id=" + user.id)
			setFolderUrl("folders/?user_id=" + user.id)
		}
	}, [user.id, setUrl, setFolderUrl, isLoggedIn])

	useEffect(() => {
		if (basePosts.length) {
			basePosts.forEach((post) => {
				newPopularPost(post)
			})
		}
	}, [basePosts, newPopularPost])

	useEffect(() => {
		if (data) {
			data.map((post) => newPost(post))
		}
	}, [data, newPost])
	useEffect(() => {
		if (folderData) {
			folderData.map((folder) => newFolder(folder))
		}
	}, [folderData, newFolder])

	console.log(folderData)

	return (
		<Box>
			<Box>
				<RenderHead title={"Home Page"} />
				<Box p={4}>
					<BoxCard
						_hover={{
							borderWidth: "10px",
							transitionDuration: "0.2s",
							transitionTimingFunction: "ease-in-out",
						}}
						py={2}
						borderWidth={"5px"}
						direction="default"
						w={"fit-content"}
						margin={"auto"}
						px={"5"}
						color={"ActiveBorder"}
					>
						<Heading color={"ActiveBorder"} textAlign={"center"}>
							Popular Files
						</Heading>
					</BoxCard>
					<SimpleGrid pt={10} spacingY={"20px"} spacingX={"20px"} minChildWidth={"100px"}>
						{popularPosts?.map((post, index) => {
							return (
								<PostProvider key={index} post={post}>
									<PostCard />
								</PostProvider>
							)
						})}
					</SimpleGrid>
				</Box>
				{posts.length > 0 && (
					<Box p={4}>
						<BoxCard
							_hover={{
								borderWidth: "10px",
								transitionDuration: "0.2s",
								transitionTimingFunction: "ease-in-out",
							}}
							py={2}
							borderWidth={"5px"}
							direction="default"
							w={"fit-content"}
							margin={"auto"}
							px={"5"}
							color={"ActiveBorder"}
						>
							<Heading color={"ActiveBorder"} textAlign={"center"}>
								Recent Files
							</Heading>
						</BoxCard>
						<Flex wrap={"wrap"} spacingY={"20px"} pt={10} minChildWidth={""}>
							{Object.values(posts)?.map((post, index) => {
								return (
									<PostProvider key={index} post={post}>
										<PostCard />
									</PostProvider>
								)
							})}
						</Flex>
					</Box>
				)}
				{folder.length > 0 && (
					<>
						<Box my={10}>
							<BoxCardOutline>
								<Heading color={"ActiveBorder"} textAlign={"center"}>
									Folders
								</Heading>
							</BoxCardOutline>
						</Box>
						<Box pb={10} m={"auto"} w={"90%"}>
							<RenderFolders gap={7} folders={folder} />
						</Box>
					</>
				)}
			</Box>
		</Box>
	)
}
export const getStaticProps = async () => {
	let { data: popularPosts } = await supabase.from("posts").select("*").eq("status", "public")
	popularPosts = popularPosts.map((item) => ({ ...item, type: "posts" }))
	return {
		props: { popularPosts },
	}
}
