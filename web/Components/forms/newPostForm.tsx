import { SimpleGrid, useMediaQuery } from '@chakra-ui/react';
import { PopoverElement } from '../ui/popover/PopoverElement';
import { Box, Input, Button, Flex, Text, InputGroup, GridItem, Grid } from '@chakra-ui/react';
import { FormInput } from '../inputs/FormInput';
import { useDispatch } from 'react-redux';
import { useFetch } from '../../hooks/useFetch';
import { submitPost } from '../../store/newPost/newPostSlice';
import formatter from '../../utils/formatting/formatting';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { SelectFolder } from '../cards/SelectFolder';
import { NewPostContext, useNewPost } from '../../context/newPostContext';
import { SelectCategory } from '../cards/SelectCategory';
import { useFolder } from '../../hooks/useFolder';
import { obj } from '../../utils/formatting/ObjectFormat';
import { VscFolder, VscFolderActive, VscSave } from 'react-icons/vsc';
import { RenderTag } from '../RenderTag';
import { newPost } from '../../utils/formatting/utils';

export const NewPostForm = ({ ...rest }) => {
	const stackPost = useFetch('');
	const folderContext = useFolder();

	const dispatch = useDispatch();
	const { categories: stackCats, setNewIds, setCategories: setStackCats } = useCategories([]);

	const newPostCtx = useNewPost();

	const [isSmall] = useMediaQuery('(max-width:768px)');

	const d = useCallback((data: Record<string, unknown>) => {}, []);

	useEffect(() => {
		if (
			!stackPost.data ||
			typeof stackPost.data !== 'object' ||
			!('title' in stackPost.data) ||
			typeof stackPost.data.title !== 'string'
		) {
			return;
		}

		newPostCtx.Update({
			title: stackPost.data.title,
		});
	}, [stackPost.data, d]);
	const handleChange = useCallback(
		async (new_url) => {
			if (new_url && formatter.url.isValid(new_url)) {
				stackPost.setUrl(`_/getPreview/?url=${new_url}`);
			}
		},
		[stackPost]
	);
	const changeCats = useCallback(
		(items) => {
			setCategories(obj.getUniques(items, 'id'));
		},
		[setCategories]
	);
	useEffect(() => {
		if (postUrl) {
			handleChange(postUrl);
		}
	}, [postUrl, handleChange]);

	const handleSubmit = (e) => {
		e.preventDefault();

		dispatch(submitPost());
	};

	return (
		<Box w={'fit-content'} maxW={'600px'} margin={'auto'} {...rest}>
			<form onSubmit={handleSubmit}>
				{newPostCtx.GetErrors(newPostCtx.Post()).map((error, index) => (
					<Text key={index} color={'red.500'}>
						{error}
					</Text>
				))}

				<Grid gap={5} gridTemplateColumns={'repeat(2, 1fr)'}>
					<GridItem>
						<FormInput
							width={'full'}
							isError={newPostCtx.GetErrors(newPostCtx.Post()).length > 0}
							HelperText={'what is the title of the post?'}
							labelText={'Post Title'}>
							<Input
								value={newPostCtx.Post().title}
								onChange={(e) => newPostCtx.Update({ title: e.target.value })}
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
									onChange={(e) => newPostCtx.Update({ post_url: e.target.value })}
								/>
							</InputGroup>
						</FormInput>
					</GridItem>
				</Grid>

				<SimpleGrid gap={5} minChildWidth={'150px'}>
					<GridItem>
						<SelectCategory
							name='NewPostForm'
							onCategoryChange={changeCats}
							baseCategories={stackCats}
						/>

						{errors.categories ? <Text color='red'>{errors.categories.message}</Text> : null}
					</GridItem>
					<GridItem>
						{post?.folder && (
							<RenderTag
								variant='outline'
								color={post?.folder?.color}
								text={post?.folder?.name}
							/>
						)}
						<PopoverElement
							triggerElement={
								<Button
									w={isSmall ? '300px' : ''}
									leftIcon={post.folder ? <VscFolderActive /> : <VscFolder />}>
									Select Folder
								</Button>
							}>
							<SelectFolder
								onChange={(folder) => setFolder(folder.id)}
								baseFolders={allFolders}
							/>
						</PopoverElement>
					</GridItem>
				</SimpleGrid>

				<Flex width={'full'} justifyContent={'center'} pt={4}>
					<Button
						w={'50%'}
						colorScheme={'yellow'}
						shadow={formatter.color.shadows.left}
						isDisabled={canSubmit}
						leftIcon={<VscSave />}
						disabled={canSubmit == false}
						type='submit'>
						Create
					</Button>
				</Flex>
			</form>
		</Box>
	);
};
