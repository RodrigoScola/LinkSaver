import { SimpleGrid, useMediaQuery } from '@chakra-ui/react';
import { PopoverElement } from '../ui/popover/PopoverElement';
import { Box, Input, Button, Flex, Text, InputGroup, GridItem, Grid } from '@chakra-ui/react';
import { FormInput } from '../inputs/FormInput';
import formatter from '../../utils/formatting/formatting';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { SelectFolder } from '../cards/SelectFolder';
import { useNewPost } from '../../context/newPostContext';
import { SelectCategory, SelectedCategories } from '../cards/SelectCategory';
import { VscFolder, VscFolderActive, VscSave } from 'react-icons/vsc';
import { RenderTag } from '../RenderTag';
import { useQuery } from '@tanstack/react-query';
import { useFolders } from '../../hooks/useFolder';
import { useObject } from '../../hooks/useObject';
import { Category, Folder } from 'shared';
import { getData } from '../../class/serverBridge';
import { useNewPostCategories } from '../../hooks/useNewPostCategories';
import { useUsers } from '../../hooks/useUser';
import { useNotifications } from '../../hooks/useNotifications';
import { usePosts } from '../../hooks/usePosts';

export const NewPostForm = ({ ...rest }) => {
	const folders = useFolders();

	const postContext = usePosts();

	const user = useUsers();

	const [shouldShowErrors, setShouldShowErrors] = useState(false);

	const postCategories = useObject<Record<number, Category>>({});

	const b = useNewPost();

	const [isSmall] = useMediaQuery('(max-width:768px)');

	const updatePostTitle = useCallback(
		(data: unknown) => {
			if (
				!data ||
				typeof data !== 'object' ||
				!('title' in data) ||
				!data.title ||
				typeof data.title !== 'string'
			) {
				return;
			}

			setShouldShowErrors(false);
			b.Update({ title: data.title });
		},
		[b.Update]
	);

	const newPostCtx = useNewPost();

	const stackPost = useQuery({
		queryKey: ['stackPost', newPostCtx.Post().post_url],
		queryFn: () =>
			getData.get(`/_/getPreview/?url=${newPostCtx.Post().post_url}`).then((res) => res.data || null),
	});

	useEffect(() => {
		if (stackPost.data && b.Post().title !== '') {
			updatePostTitle(stackPost.data);
		}
	}, [stackPost.data, updatePostTitle]);

	//TODO: FIX THIS
	const changeCats = useCallback(
		(items: unknown) => {
			if (!items || !Array.isArray(items)) return;

			postCategories.set(
				items.reduce((acc, item) => {
					acc[item.id] = item;
					return acc;
				}, {})
			);
		},

		[]
	);

	const pcat = useNewPostCategories();

	const notifications = useNotifications();

	useEffect(() => {
		console.log(`updating user id`, user.user.id);
		b.Update({ userId: user.user.id });
	}, [user.user.id]);

	const createPost = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (b.Post().userId == -1) {
			console.error(`invalid user`, user.user.id);
			return;
		}

		if (b.GetErrors(b.Post()).length > 0) {
			setShouldShowErrors(true);
			return;
		}

		console.log(`current, ${b.Post().userId}`);

		const post = await b.SubmitPost(b.Post());

		if (!post) {
			notifications.add({
				title: 'Could not create post',
				status: 'error',
			});
			return;
		}

		notifications.add({
			title: 'Post created',
		});

		postContext.AddPost(post);

		await Promise.all(
			Object.values(postCategories.value).map((cat) =>
				pcat.create({
					category_id: cat.id,
					status: cat.status,
					post_id: post.id,
					userId: cat.userId,
				})
			)
		);

		// window.location.reload();
	};

	const folderContext = useFolders();

	const postFolder = useQuery({
		queryKey: ['folder', b.Post().parent],
		queryFn: () => folderContext.GetFolder(b.Post().parent!),
		enabled: !!b.Post().parent,
	});

	// const folderFetcher = useQuery({
	// 	queryKey: ['folders'],
	// 	queryFn: () =>
	// 		getData.get('/folders').then((f) => {
	// 			for (const folder of f.data) folderContext.AddFolder(folder);
	// 		}),
	// });

	const categoryCtx = useCategories();
	const categoryFetcher = useQuery({
		queryKey: ['categories', user],
		enabled: Boolean(user.user.id),
		queryFn: () =>
			getData.get(`/categories/?userId=${user.user.id}`).then((cats) => {
				for (const cat of cats.data) categoryCtx.AddCategory(cat);
			}),
	});

	const categoryObject = useObject<Record<number, SelectedCategories>>();

	useEffect(() => {
		for (const category of categoryFetcher.data || ([] as Category[])) {
			categoryObject.update({
				[category.id]: {
					isSelected: categoryObject.value[category.id]?.isSelected ?? false,
					id: category.id,
					color: category.color,
					name: category.name,
					status: category.status,
					userId: category.userId,
				},
			});
		}
	}, [categoryCtx.categories]);

	const Update = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		b.Update({ [e.target.name]: e.target.value });
		setShouldShowErrors(false);
	}, []);

	const UpdateFolder = useCallback((folder: Folder) => {
		b.Update({ parent: folder.id });
		setShouldShowErrors(false);
	}, []);

	return (
		<Box w={'fit-content'} maxW={'600px'} margin={'auto'} {...rest}>
			<form onSubmit={createPost}>
				{b.GetErrors(b.Post()).length > 0 &&
					b.GetErrors(b.Post()).map((error) => (
						<Text key={error} color='red'>
							{error}
						</Text>
					))}
				<Grid gap={5} gridTemplateColumns={'repeat(2, 1fr)'}>
					<GridItem>
						<FormInput
							width={'full'}
							HelperText={'what is the title of the post?'}
							labelText={'Post Title'}>
							<Input name='title' value={b.Post().title} onChange={Update} />
						</FormInput>
					</GridItem>
					<GridItem>
						<FormInput
							HelperText={'what is the url of the post?'}
							labelText={'Post url'}
							errorMessage={'invalid post url'}
							w={'100%'}>
							<InputGroup>
								<Input
									value={b.Post().post_url}
									type={'url'}
									name='post_url'
									onChange={Update}
								/>
							</InputGroup>
						</FormInput>
					</GridItem>
				</Grid>

				<SimpleGrid gap={5} minChildWidth={'150px'}>
					<GridItem>
						<SelectCategory
							name='NewPostForm'
							defaultSelected={true}
							onCategoryChange={changeCats}
							baseCategories={Object.values(categoryObject.value)}
						/>
					</GridItem>
					<GridItem>
						{b.Post().parent && postFolder.data && (
							<RenderTag
								variant='outline'
								color={postFolder.data.color}
								text={postFolder.data.title}
							/>
						)}
						<PopoverElement
							triggerElement={
								<Button
									w={isSmall ? '300px' : ''}
									leftIcon={b.Post().parent ? <VscFolderActive /> : <VscFolder />}>
									Select Folder
								</Button>
							}>
							<SelectFolder onChange={UpdateFolder} baseFolders={folders.GetFolders()} />
						</PopoverElement>
					</GridItem>
				</SimpleGrid>

				<Flex width={'full'} justifyContent={'center'} pt={4}>
					<Button
						w={'50%'}
						colorScheme={'yellow'}
						shadow={formatter.color.shadows.left}
						isDisabled={b.CanSubmit()}
						leftIcon={<VscSave />}
						disabled={b.CanSubmit() == false}
						type='submit'>
						Create
					</Button>
				</Flex>
			</form>
		</Box>
	);
};
