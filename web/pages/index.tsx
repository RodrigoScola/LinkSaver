import { Box, Heading } from '@chakra-ui/react';
import { usePosts } from '../hooks/usePosts';
import { useFolders } from '../hooks/useFolder';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BoxCard } from '../Components/cards/BoxCard';
import { BoxCardOutline } from '../Components/cards/BoxCardOutline';
import { RenderHead } from '../Components/RenderHead';
import { RenderPosts } from '../Components/RenderPosts';
import { PostProvider } from '../context/PostContext';
import { useCategories } from '../hooks/useCategories';
import { Category, Folder, Post, PostCategories } from 'shared';
import { usePostCategory } from '../hooks/usePostCategories';
import { getData } from '../class/serverBridge';
const PostCard = dynamic(() => import('../Components/cards/PostCard').then((r) => r.PostCard));
const RenderFolders = dynamic(() => import('../Components/postTypes/renderFolders').then((r) => r.RenderFolders));

export default function Home({
	popularPosts: basePosts,
	baseCategories = [],
	folders,
	postCategories,
}: {
	popularPosts: Post[];
	baseCategories: Category[];
	folders: Folder[];
	postCategories: PostCategories[];
}) {
	const folderCtx = useFolders();
	const PostContext = usePosts();

	const postCat = usePostCategory();
	const CatContext = useCategories();

	useEffect(() => {
		for (const category of baseCategories) CatContext.AddCategory(category);
	}, [baseCategories]);

	useEffect(() => {
		for (const postCategory of postCategories) postCat.AddPostCategory(postCategory);
	}, []);

	useEffect(() => {
		for (const post of basePosts) PostContext.AddPost(post);
	}, [basePosts]);

	useEffect(() => {
		for (const folder of folders) folderCtx.AddFolder(folder);
	}, [folders]);

	return (
		<Box>
			<Box>
				<RenderHead title={'Home Page'} />
				{/* TODO: MAKE THE POPULAR PART */}
				{/* <Box p={4}>
					<BoxCard
						_hover={{
							borderWidth: '10px',
							transitionDuration: '0.2s',
							transitionTimingFunction: 'ease-in-out',
						}}
						py={2}
						borderWidth={'5px'}
						direction='default'
						w={'fit-content'}
						margin={'auto'}
						px={'5'}
						color={'ActiveBorder'}>
						<Heading color={'ActiveBorder'} textAlign={'center'}>
							Popular Files
						</Heading>
					</BoxCard>
				</Box> */}
				{Object.values(PostContext.Posts()).length > 0 && (
					<Box p={4}>
						<BoxCard
							_hover={{
								borderWidth: '10px',
								transitionDuration: '0.2s',
								transitionTimingFunction: 'ease-in-out',
							}}
							py={2}
							borderWidth={'5px'}
							direction='up'
							w={'fit-content'}
							margin={'auto'}
							px={'5'}
							color={'ActiveBorder'}>
							<Heading color={'ActiveBorder'} textAlign={'center'}>
								Recent Files
							</Heading>
						</BoxCard>
						<RenderPosts>
							{Object.values(PostContext.Posts())
								.sort((a, b) => b.id - a.id)
								?.map((post, index) => {
									return (
										<PostProvider key={index} post={post}>
											<PostCard />
										</PostProvider>
									);
								})}
						</RenderPosts>
					</Box>
				)}

				<Box my={10}>
					<BoxCardOutline>
						<Heading color={'ActiveBorder'} textAlign={'center'}>
							Folders
						</Heading>
					</BoxCardOutline>
				</Box>
				<Box pb={10} m={'auto'} w={'90%'}>
					<RenderFolders gap={7} folders={Object.values(folderCtx.GetFolders())} />
				</Box>
			</Box>
		</Box>
	);
}
export const getServerSideProps = async () => {
	const posts: Post[] = await getData.get('/posts');
	const folders: Post[] = await getData.get('/folders');

	const postCategories = await Promise.allSettled(
		posts.map((post) => getData.get(`/postCategories/?post_id=${post.id}`))
	);

	const categories = (
		await Promise.allSettled(
			postCategories.reduce((all: Promise<any>[], postCategory) => {
				if (postCategory.status == 'fulfilled' && postCategory.value) {
					const val = postCategory.value as PostCategories[];
					for (const mainca of val) {
						all.push(getData.get(`/categories/${mainca.category_id}`));
					}
				}

				return all;
			}, [])
		)
	)
		.filter((promise) => promise.status === 'fulfilled')
		.map((promise) => promise.value);

	return {
		props: {
			postCategories: postCategories
				.filter((f) => f.status === 'fulfilled')
				.map((f) => f.value)
				.flat(),
			popularPosts: posts.sort((a, b) => b.id - a.id),
			baseCategories: categories,
			folders: folders,
		},
	};
};
