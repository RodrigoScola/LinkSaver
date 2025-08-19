import { ChangeEvent, useCallback, useEffect } from 'react';
import { usePost } from '../../context/PostContext';
import { Box, Button, ButtonGroup, Divider, Flex, Heading, Link, Skeleton, Tag, Image } from '@chakra-ui/react';
import { LikeButton } from '../Buttons/LikeButton';
import { ModalComponent } from '../ui/modals/ModalComponent';
import { RenderCategories } from '../postTypes/RenderCategories';
import { useCategories } from '../../hooks/useCategories';
import { DeleteButton } from '../Buttons/DeleteButton';
import { EditPostCard } from './EditPostCard';
import { useState } from 'react';
import { VscEdit, VscSave, VscTrash } from 'react-icons/vsc';
import formatter from '../../utils/formatting/formatting';
import { BoxCard } from './BoxCard';
import { usePostCategory } from '../../hooks/usePostCategories';
import { Category, Folder, PostCategories } from 'shared';
import { ObjectFormat } from '../../utils/formatting/ObjectFormat';
import { SelectFolder } from './SelectFolder';
import { getData } from '../../class/serverBridge';
import { useQuery } from '@tanstack/react-query';
import { useUsers } from '../../hooks/useUser';
import { SelectedCategories } from './SelectCategory';
import { AsyncQueue } from '../../class/AsyncQueue';
import { useNotifications } from '../../hooks/useNotifications';
import { color } from '../../utils/formatting/ColorFormat';

export const PostCard = () => {
	const { post, isCreator, save } = usePost();

	const catContext = useCategories();

	const postCategoriesCtx = usePostCategory();

	const [currPost, setCurrPost] = useState(post);

	const noop = () => {};

	const notifications = useNotifications();

	const [currentCategories, setCurrentCategories] = useState<Record<number, Category>>({});

	const [postCategories, setPostCategories] = useState<PostCategories[]>([]);

	const onCategoryChange = useCallback(
		async (categories: SelectedCategories[]) => {
			const removedCategories: SelectedCategories[] = [];

			const newCategories: SelectedCategories[] = [];

			for (const category of categories) {
				if (category.id in currentCategories && !category.isSelected) {
					removedCategories.push(category);
				} else if (!(category.id in currentCategories) && category.isSelected) {
					newCategories.push(category);
				}
			}

			const queue = new AsyncQueue();

			const removedPostCategories = postCategories.filter((pc) =>
				removedCategories.find((rc) => rc.id === pc.category_id)
			);

			queue.Add(
				'removed_categories',
				Promise.allSettled(
					removedPostCategories.map((pc) => postCategoriesCtx.RemovePostCategory(pc))
				)
			)
				.Add(
					'added_categories',
					Promise.allSettled(
						newCategories.map((nc) =>
							postCategoriesCtx.CreatePostCategory({
								post_id: post.id,
								userId: user.user.id,
								status: 'public',
								category_id: nc.id,
							})
						)
					)
				)
				.Build();

			await fetchCategories();

			notifications.add({
				title: 'Categories updated',
				description: 'Your post categories have been updated successfully.',
				status: 'success',
			});
		},
		[catContext]
	);

	const onChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			if (!e.target) {
				return;
			}
			setCurrPost((curr) => ({ ...curr, [e.target.name]: e.target.value }));
		},
		[setCurrPost]
	);

	const fetchCategories = useCallback(async () => {
		try {
			let pcat: PostCategories[] = [];
			try {
				pcat = await postCategoriesCtx.GetPostCategories(post.id);
			} catch (err) {
				console.error(err);
			}

			setPostCategories(pcat);

			const cats = (
				await Promise.allSettled(
					pcat.map((postCategory) => catContext.GetCategory(postCategory.category_id))
				)
			)
				.filter((promise) => promise.status === 'fulfilled')
				.map((promise) => promise.value)
				.filter(Boolean);

			setCurrentCategories(ObjectFormat.toObj(cats.filter(Boolean) as Category[], 'id'));

			for (const category of cats) {
				if (!category) {
					continue;
				}

				catContext.AddCategory(category);
			}
		} catch (err) {
			console.error(`could not fetch post categories`, err);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
	}, [post.id]);

	const updatePo = async () => {
		try {
			await save(currPost);

			notifications.add({
				title: 'Post updated',
				description: 'Your post has been updated successfully.',
				status: 'success',
				duration: 1000,
			});
		} catch (err) {
			console.error('Error updating post:', err);

			notifications.add({
				title: 'Error updating post',
				description: 'There was an error updating your post. Please try again.',

				duration: 500,
				status: 'error',
			});
		}
	};

	const user = useUsers();

	const foldersFetcher = useQuery({
		queryKey: ['folders', user.user.id],
		queryFn: () => getData.get(`/folders/?userId=${user.user.id}`),
		refetchOnWindowFocus: false,
		initialData: [],
	});

	const currentFolder = useQuery({
		queryKey: ['folder', post.parent],
		queryFn: () => getData.get(`/folders/${post.parent}`).then((r) => r || {}),
		refetchOnWindowFocus: false,
		enabled: Boolean(post.parent),
		initialData: {},
		placeholderData: {},
	});

	const updateFolder = useCallback(async (folder: Folder) => {
		if (!folder) {
			console.error(`invalid folder`);
			return;
		}

		const changeId = post.parent === folder.id ? -1 : folder.id;

		await save({ ...post, parent: changeId });

		currentFolder.refetch();
	}, []);

	const stackPost = useQuery({
		queryKey: ['stackPost', post.post_url],
		queryFn: () => getData.get(`/_/getPreview/?url=${post.post_url}`),
		initialData: {
			images: [],
		},
	});

	return (
		<BoxCard height={'fit-content'} minW={'200px'} w={'30%'} p={3} maxW={'400px'}>
			<Box pb={2}>
				<Flex alignItems={'center'} justifyContent={'space-between'}>
					<Link href={post?.post_url ? post?.post_url : '#'}>
						<Heading wordBreak={'break-all'} size={'md'} textTransform={'capitalize'}>
							{post.title}
						</Heading>
					</Link>
				</Flex>
			</Box>
			{stackPost.data && stackPost.data.images.length > 0 && (
				<Image
					shadow={color.shadows.left}
					alt={stackPost.data.title}
					src={stackPost.data.images[0]}
				/>
			)}
			<Box mb={3} py={0}>
				<RenderCategories categories={Object.values(currentCategories)} />
			</Box>

			{currentFolder.data?.title && (
				<>
					<Tag mb={2} color={currentFolder.data.color}>
						Folder: {currentFolder.data.title}
					</Tag>
				</>
			)}
			<Divider borderWidth={'1px'} mt={1} />
			<Box display={'flex'} justifyContent={'right'}>
				<ButtonGroup>
					<LikeButton size={'sm'} />
					{isCreator(user.user.id) ? (
						<>
							<ModalComponent
								// color={'purple'}
								onClose={noop}
								footerElement={
									<Button
										colorScheme={'yellow'}
										leftIcon={<VscSave />}
										onClick={updatePo}>
										Save
									</Button>
								}
								triggerElement={
									<Button
										size={'sm'}
										shadow={formatter.color.shadows.right}
										variant={'outline'}
										colorScheme={'blue'}>
										<VscEdit />
									</Button>
								}
								headerText={'Edit post'}>
								<EditPostCard
									OnSubmit={updatePo}
									baseFolders={foldersFetcher.data}
									categories={Object.values(currentCategories)}
									post={post}
									onChange={onChange}
									onFolderChange={updateFolder}
									defaultSelectedFolder={
										foldersFetcher.data?.find(
											(folder: Folder) => folder.id === post.parent
										) || null
									}
									onCategoryChange={onCategoryChange}
								/>
							</ModalComponent>
							<Skeleton borderRadius={'12px'} isLoaded={Boolean(post.title) || false}>
								<ModalComponent
									onClose={noop}
									footerElement={<DeleteButton />}
									triggerElement={
										<Button
											shadow={formatter.color.shadows.right}
											variant={'outline'}
											size={'sm'}
											colorScheme={'red'}>
											<VscTrash />
										</Button>
									}
									headerText={
										<Heading size={'xl'}>
											Are you sure you want to delete this post?
										</Heading>
									}></ModalComponent>
							</Skeleton>
						</>
					) : null}
				</ButtonGroup>
			</Box>
		</BoxCard>
	);
};
