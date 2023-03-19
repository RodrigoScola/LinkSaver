import { Flex, SimpleGrid, useMediaQuery } from "@chakra-ui/react"
import { BoxCardOutline } from "../Components/cards/BoxCardOutline"
import { Box, Grid, Heading } from "@chakra-ui/react"
import { usePosts } from "../hooks/usePosts"
import { useFolder } from "../hooks/useFolder"
import { useEffect, useMemo } from "react"
import { useUsers } from "../hooks/useUser"
import { BoxCard } from "../Components/cards/BoxCard"
import { useFetch } from "../hooks/useFetch"
import { RenderHead } from "../Components/RenderHead"
import { getData } from "../class/serverBridge"
import { PostProvider } from "../context/PostContext"
import { RenderPosts } from "../Components/RenderPosts"
import { getUniques } from "../utils/formatting/ObjectFormat"

import dynamic from "next/dynamic"
import { supabase } from "../lib/supabaseClient"
import { useCategories } from "../hooks/useCategories"
const PostCard = dynamic(() => import("../Components/cards/PostCard").then((r) => r.PostCard))
const RenderFolders = dynamic(() => import("../Components/postTypes/renderFolders").then((r) => r.RenderFolders))

export default function Home({ popularPosts: basePosts, baseCategories = [] }) {
	const _ = useCategories(baseCategories)
	const [user] = useUsers()
	const { data: folderData, setUrl: setFolderUrl } = useFetch("")
	const isLoggedIn = user.id ? true : false
	const { folder, newFolder } = useFolder([])
	const { data, setUrl } = useFetch("")
	const { posts, newPost } = usePosts([])
	const { posts: popularPosts, newPost: newPopularPost } = usePosts([])

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
			data.reverse().map((post) => newPost(post))
		}
	}, [data, newPost])
	useEffect(() => {
		if (folderData) {
			folderData.map((folder) => newFolder(folder))
		}
	}, [folderData, newFolder])

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
					<RenderPosts>
						{popularPosts?.map((post, index) => {
							return (
								<PostProvider key={index} post={post}>
									<PostCard />
								</PostProvider>
							)
						})}
					</RenderPosts>
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
						<RenderPosts>
							{Object.values(posts)?.map((post, index) => {
								return (
									<PostProvider key={index} post={post}>
										<PostCard />
									</PostProvider>
								)
							})}
						</RenderPosts>
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
	let catIds = new Set()

	popularPosts.forEach((post) => {
		post?.categories.forEach((catid) => {
			catIds.add(catid)
		})
	})

	popularPosts = popularPosts.map((item) => ({ ...item, type: "posts" }))

	return {
		props: { popularPosts, baseCategories: [...catIds] },
	}
}
