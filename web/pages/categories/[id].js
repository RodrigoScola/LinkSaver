import { getData } from "../../class/serverBridge"
import { Box, Center, Heading } from "@chakra-ui/react"
import { usePosts } from "../../hooks/usePosts"
import { PostCard } from "../../Components/cards/PostCard"
import { PostProvider } from "../../context/PostContext"
import { BoxCard } from "../../Components/cards/BoxCard"
import { Grid } from "@chakra-ui/react"
import formatter from "../../utils/formatting/formatting"
import { RenderHead } from "../../Components/RenderHead"
import { useEffect } from "react"
export default function FOLDERID({ category, posts: basePosts }) {
	const { posts, newPost } = usePosts([])

	useEffect(() => {
		basePosts.value?.map((post) => newPost(post))
	}, [basePosts, newPost])

	return (
		<Box>
			<RenderHead title={formatter.str.capitalize(category?.cat_name)} />
			<Box>
				<Center>
					<BoxCard padding={2} color={category?.cat_color}>
						<Heading color={category?.cat_color} fontSize={"40px"} py={2} textAlign={"center"}>
							{category?.cat_name}
						</Heading>
					</BoxCard>
				</Center>
			</Box>
			<Box>
				{posts.length > 0 && (
					<Box p={4}>
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
			</Box>
			{posts.length == 0 && (
				<Heading pt={10} textAlign={"center"}>
					Oops! There doesnt seem to be any posts here!
				</Heading>
			)}
		</Box>
	)
}

export const getStaticPaths = async (ctx) => {
	const ids = await getData.getData("/categories/?select=id")
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
	let category = await getData.getPost("categories", id)
	const posts = await getData.getData("categories/" + id + "/posts")
	if (!id || !category) {
		category = { cat_name: "default category name", cat_color: "#000000" }
	}
	return {
		props: {
			category: category,
			posts: posts,
		},
		revalidate: 100,
	}
}
