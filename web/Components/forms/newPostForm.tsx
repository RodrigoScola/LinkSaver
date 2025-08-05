import { SimpleGrid, useMediaQuery } from '@chakra-ui/react';
import { PopoverElement } from '../ui/popover/PopoverElement';
import { Box, Input, Button, Flex, Text, InputGroup, GridItem, Grid } from '@chakra-ui/react';
import { FormInput } from '../inputs/FormInput';
import formatter from '../../utils/formatting/formatting';
import { FormEvent, useCallback, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { SelectFolder } from '../cards/SelectFolder';
import { useNewPost } from '../../context/newPostContext';
import { SelectCategory, SelectedCategories } from '../cards/SelectCategory';
import { VscFolder, VscFolderActive, VscSave } from 'react-icons/vsc';
import { RenderTag } from '../RenderTag';
import { useQuery } from '@tanstack/react-query';
import { useFolders } from '../../hooks/useFolder';
import { useObject } from '../../hooks/useObject';
import { Category, PostCategories } from 'shared';
import { getData } from '../../class/serverBridge';
import { useNewPostCategories } from '../../hooks/useNewPostCategories';

export const NewPostForm = ({ ...rest }) => {
	const folders = useFolders();

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

			b.Update({ title: data.title });
		},
		[b.Update]
	);

	const newPostCtx = useNewPost();

	const stackPost = useQuery({
		queryKey: ['stackPost'],
		queryFn: () => getData.get(`/_/getPreview/?url=${newPostCtx.Post().post_url}`).then((res) => res.data),
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

	const createPost = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const post = await b.SubmitPost();

		await Promise.all(
			Object.values(postCategories.value).map((cat) =>
				pcat.create({
					category_id: cat.id,
					post_id: post.id,
				})
			)
		);
	};

	const folderContext = useFolders();

	const postFolder = useQuery({
		queryKey: ['folder', b.Post().parent],
		queryFn: () => folderContext.GetFolder(b.Post().parent!),
		enabled: !!b.Post().parent,
	});

	const folderFetcher = useQuery({
		queryKey: ['folders'],
		queryFn: () =>
			getData.get('/folders').then((f) => {
				for (const folder of f.data) folderContext.AddFolder(folder);
			}),
	});

	const categoryCtx = useCategories();
	const categoryFetcher = useQuery({
		queryKey: ['categories'],
		queryFn: () =>
			getData.get('/categories').then((cats) => {
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

	return (
		<Box w={'fit-content'} maxW={'600px'} margin={'auto'} {...rest}>
			<form onSubmit={createPost}>
				{b.GetErrors(b.Post()).map((error) => (
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
							<Input
								value={b.Post().title}
								onChange={(event) => b.Update({ title: event.target.value })}
							/>
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
									type={'url'}
									name='stack_post_url'
									onChange={(e) => b.Update({ post_url: e.target.value })}
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
							<SelectFolder
								onChange={(folder) => b.Update({ parent: folder.id })}
								baseFolders={folders.GetFolders()}
							/>
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
