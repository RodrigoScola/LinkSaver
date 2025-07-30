import { Box, color, Heading } from '@chakra-ui/react';
import { usePosts } from '../hooks/usePosts';
import { useFolder } from '../hooks/useFolder';
import { useEffect } from 'react';
import { useUsers } from '../hooks/useUser';
import { useFetch } from '../hooks/useFetch';
import dynamic from 'next/dynamic';
import { useDispatch } from 'react-redux';
import { add_categories } from '../store/category/CategorySlice';
import { getData } from '../class/serverBridge';
import { BoxCard } from '../Components/cards/BoxCard';
import { BoxCardOutline } from '../Components/cards/BoxCardOutline';
import { RenderHead } from '../Components/RenderHead';
import { RenderPosts } from '../Components/RenderPosts';
import { PostProvider } from '../context/PostContext';
import { useCategories } from '../hooks/useCategories';
import { Category, Folder, Post, PostCategories } from 'shared';
import { PostCategoryProvider, usePostCategory } from '../hooks/usePostCategories';
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
	const { folder, newFolder } = useFolder([]);
	const { data, setUrl } = useFetch('');
	const PostContext = usePosts();

	const postCat = usePostCategory();
	const CatContext = useCategories();

	const dispatch = useDispatch();
	useEffect(() => {
		for (const category of baseCategories) {
			CatContext.AddCategory(category);
		}
		dispatch(add_categories(baseCategories));
	}, [baseCategories]);

	useEffect(() => {
		for (const postCategory of postCategories) {
			postCat.AddPostCategory(postCategory);
		}
	}, []);

	useEffect(() => {
		if (basePosts.length) {
			for (const post of basePosts) {
				PostContext.AddPost(post);
			}
		}
	}, [basePosts]);

	useEffect(() => {
		if (data && Array.isArray(data)) {
			data.map((post) => PostContext.AddPost(post));
		}
	}, [data]);
	useEffect(() => {
		if (folders) {
			console.log('folders', { folders });
			folders.map((folder) => newFolder(folder));
		}
	}, [folders, newFolder]);

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
							direction='default'
							w={'fit-content'}
							margin={'auto'}
							px={'5'}
							color={'ActiveBorder'}>
							<Heading color={'ActiveBorder'} textAlign={'center'}>
								Recent Files
							</Heading>
						</BoxCard>
						<RenderPosts>
							{Object.values(PostContext.Posts())?.map((post, index) => {
								return (
									<PostProvider key={index} post={post}>
										<PostCard />
									</PostProvider>
								);
							})}
						</RenderPosts>
					</Box>
				)}

				{folder.length > 0 && (
					<>
						<Box my={10}>
							<BoxCardOutline>
								<Heading color={'ActiveBorder'} textAlign={'center'}>
									Folders
								</Heading>
							</BoxCardOutline>
						</Box>
						<Box pb={10} m={'auto'} w={'90%'}>
							<RenderFolders gap={7} folders={folder} />
						</Box>
					</>
				)}
			</Box>
		</Box>
	);
}
export const getServerSideProps = async () => {
	const posts: Post[] = await getData.getData('/posts');
	const folders: Post[] = await getData.getData('/folders');

	const postCategories = await Promise.allSettled(
		posts.map((post) => getData.getData(`/posts/${post.id}/categories`))
	);

	const categories = (
		await Promise.allSettled(
			postCategories.reduce((all: Promise<any>[], postCategory) => {
				if (postCategory.status == 'fulfilled' && postCategory.value) {
					const val = postCategory.value as PostCategories[];
					for (const mainca of val) {
						all.push(getData.getData(`/categories/${mainca.category_id}`));
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
			popularPosts: posts,
			baseCategories: categories,
			folders: folders,
		},
	};
};
