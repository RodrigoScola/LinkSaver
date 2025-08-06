import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { usePost } from '../../context/PostContext';
import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Divider,
	Flex,
	Heading,
	Img,
	Link,
	Skeleton,
} from '@chakra-ui/react';
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
import e from 'express';
import { Category, Folder, PostCategories } from 'shared';
import { ObjectFormat } from '../../utils/formatting/ObjectFormat';
import folders from '../../pages/folders';
import { SelectFolder } from './SelectFolder';
import { getData } from '../../class/serverBridge';
import { useQuery } from '@tanstack/react-query';
import { useUsers } from '../../hooks/useUser';

export const PostCard = () => {
	const { post, isCreator, save } = usePost();

	const catContext = useCategories();

	const postCategoriesCtx = usePostCategory();

	const [currPost, setCurrPost] = useState(post);
	const closeElement = () => {};

	const [currentCategories, setCurrentCategories] = useState<Record<number, Category>>({});

	const [postCategories, setPostCategories] = useState<PostCategories[]>([]);

	const onCategoryChange = useCallback(
		async (categories: Category[]) => {
			const invalidCategoryIds = Object.values(postCategories).filter(
				(cat) => !categories.some((c) => c.id === cat.category_id)
			);

			const newCategories = categories.filter((cat) => !(cat.id in currentCategories));

			console.log('categories', categories);

			console.log('invalidCategoryIds', invalidCategoryIds, 'new ', newCategories, categories);

			await Promise.all(
				invalidCategoryIds.map((postCategory) => postCategoriesCtx.RemovePostCategory(postCategory))
			);

			const createdPostCategories = (
				await Promise.all(
					newCategories.map((category) =>
						postCategoriesCtx.CreatePostCategory({
							category_id: category.id,
							post_id: post.id,
							status: 'public',
							userId: user.user.id,
						})
					)
				)
			).filter(Boolean);
			// setPostCategories(createdPostCategories);

			console.log(createdPostCategories, ' the created');
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

	useEffect(() => {
		async function go() {
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
				console.log(`this is post id error`, err);
			}
		}
		go();
	}, [post.id]);

	const updatePo = async () => {
		//TODO: server side post

		await save(currPost);

		// dispatch(serverSavePost(currPost));
	};

	const user = useUsers();

	const foldersFetcher = useQuery({
		queryKey: ['folders', user.user.id],
		queryFn: () => getData.get(`/folders/?userId=${user.user.id}`),
		refetchOnWindowFocus: false,
		initialData: [],
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
			<Box py={0}>
				<RenderCategories categories={Object.values(currentCategories)} />
				<Divider borderWidth={'2px'} mt={3} />
			</Box>
			<Box display={'flex'} justifyContent={'right'}>
				<ButtonGroup>
					<LikeButton size={'sm'} />
					{isCreator(user.user.id) ? (
						<>
							<ModalComponent
								// color={'purple'}
								onClose={closeElement}
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
									categories={Object.values(currentCategories)}
									post={post}
									onChange={onChange}
									onCategoryChange={onCategoryChange}
								/>

								<SelectFolder
									baseFolders={foldersFetcher.data}
									onChange={(f) => save({ ...post, parent: f.id })}
									defaultSelected={
										foldersFetcher.data?.find(
											(folder: Folder) => folder.id === post.parent
										) || null
									}
								/>
							</ModalComponent>
							<Skeleton borderRadius={'12px'} isLoaded={Boolean(post.title) || false}>
								<ModalComponent
									// color={'red'}
									onClose={closeElement}
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
