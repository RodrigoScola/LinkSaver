import { getData } from "../../class/serverBridge"
import { useFolder } from "../../hooks/useFolder"
import { Box, Center, Heading, Grid } from "@chakra-ui/react"
import { useEffect } from "react"
import { FolderProvider } from "../../context/FolderContext"
import { FolderCard } from "../../Components/cards/folderCard"
import { PostProvider } from "../../context/PostContext"
import { PostCard } from "../../Components/cards/PostCard"
import { usePosts } from "../../hooks/usePosts"
import formatter from "../../utils/formatting/formatting"
import { BoxCard } from "../../Components/cards/BoxCard"
import { BoxCardOutline } from "../../Components/cards/BoxCardOutline"
import { RenderHead } from "../../Components/RenderHead"
export default function FOLDERID({ folder: baseFolder }) {
	const { posts, newPost } = usePosts([])
	const { folder, newFolder } = useFolder([])
	useEffect(() => {
		if (baseFolder) {
			baseFolder.items.value.map((item) => {
				if (item.type == "posts") {
					newPost({ ...item, id: item.item_id })
				} else if (item.type == "folders") {
					newFolder({ ...item, id: item.item_id })
				}
			})
		}
	}, [baseFolder, newFolder])

	return (
		<Box>
			<RenderHead title={"Folder: " + baseFolder?.name} />
			<Box pb={3}>
				<Center>
					<BoxCard color={baseFolder?.color}>
						<Heading textAlign={"center"} color={baseFolder?.color}>
							{formatter.str.capitalize(baseFolder.name)}
						</Heading>
					</BoxCard>
				</Center>
			</Box>
			{folder.length > 0 && (
				<Box pt={3}>
					<BoxCardOutline>
						<Heading textAlign={"center"}>Folders</Heading>
					</BoxCardOutline>

					<Box>
						{folder?.map((item) => {
							return (
								<FolderProvider key={item.id} folder={item}>
									<FolderCard />
								</FolderProvider>
							)
						})}
					</Box>
				</Box>
			)}
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
					<Grid pt={10} gridTemplateColumns={"repeat(4, 1fr)"} rowGap={5} columnGap={7}>
						{Object.values(posts)?.map((post, index) => {
							return (
								<PostProvider key={index} post={post}>
									<PostCard />
								</PostProvider>
							)
						})}
					</Grid>
				</Box>
			)}
			{posts.length == 0 && folder.length == 0 && (
				<Box>
					<Heading textAlign={"center"}>There doesnt seem to have any posts here yet!</Heading>
				</Box>
			)}
		</Box>
	)
}
export const getStaticPaths = async (ctx) => {
	if (process.env.SKIP_BUILD_STATIC_GENERATION) {
		return {
			paths: [],
			fallback: "blocking",
		}
	}
	const ids = await getData.getData("/folders/?select=id")
	const paths = ids.map((id) => {
		id = String(id)
		return {
			params: { id },
		}
	})
	return {
		paths,
		fallback: "blocking",
	}
}

export const getStaticProps = async ({ params }) => {
	const id = params.id

	let folder = await getData.getPost("folders", id)
	const posts = await getData.getData(`folders/${id}/posts`)
	if (posts) {
		folder = { ...folder, items: posts }
	}
	if (!folder) {
		return {
			notFound: true,
		}
	}
	return {
		props: {
			folder: folder,
		},
		revalidate: 100,
	}
}
