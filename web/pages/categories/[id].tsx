import { getData } from '../../class/serverBridge';
import { Box, Center, Heading } from '@chakra-ui/react';
import { usePosts } from '../../hooks/usePosts';
import { PostCard } from '../../Components/cards/PostCard';
import { PostProvider } from '../../context/PostContext';
import { BoxCard } from '../../Components/cards/BoxCard';
import { Grid } from '@chakra-ui/react';
import formatter from '../../utils/formatting/formatting';
import { RenderHead } from '../../Components/RenderHead';
import { useEffect } from 'react';
import { newPost } from '../../utils/formatting/utils';
import { Category, Post } from 'shared';

// TODO: ADD FOLDER ID AND FILTER POSTS TO ONLY SHOW WITH THE SAME ID
// TODO: change from static paths and props to server side props
// * just a precaution

export default function CategoryID({ category, posts: basePosts }: { category: Category; posts: Post[] }) {
	const postCtx = usePosts();

	useEffect(() => {
		for (const post of basePosts) {
			postCtx.AddPost(post);
		}
	}, [basePosts, newPost]);

	return (
		<Box>
			<RenderHead title={formatter.str.capitalize(category?.name)} />
			<Box>
				<Center>
					<BoxCard padding={2} color={category?.color}>
						<Heading color={category?.color} fontSize={'40px'} py={2} textAlign={'center'}>
							{category?.name}
						</Heading>
					</BoxCard>
				</Center>
			</Box>
			<Box>
				{Object.values(postCtx.Posts()).length > 0 && (
					<Box p={4}>
						<Grid pt={10} gridTemplateColumns={'repeat(4, 1fr)'} rowGap={5} columnGap={7}>
							{Object.values(postCtx.Posts())?.map((post, index) => {
								return (
									<PostProvider key={index} post={post}>
										<PostCard />
									</PostProvider>
								);
							})}
						</Grid>
					</Box>
				)}
			</Box>
			{Object.values(postCtx.Posts()).length == 0 && (
				<Heading pt={10} textAlign={'center'}>
					Oops! There doesnt seem to be any posts here!
				</Heading>
			)}
		</Box>
	);
}

export const getStaticProps = async ({ params }) => {
	const id = params.id;
	let category = await getData.getPost('categories', id);
	const posts = await getData.get('categories/' + id + '/posts');
	if (!id || !category) {
		category = { cat_name: 'default category name', cat_color: '#000000' };
	}
	return {
		props: {
			category: category,
			posts: posts,
		},
		revalidate: 100,
	};
};
