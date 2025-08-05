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
import { Category, PostCategories } from 'shared';
import { ObjectFormat } from '../../utils/formatting/ObjectFormat';
import folders from '../../pages/folders';
import { SelectFolder } from './SelectFolder';

export const PostCard = () => {
	const { post, isCreator } = usePost();
	const catContext = useCategories();

	const postCategories = usePostCategory();

	const [currPost, setCurrPost] = useState(post);
	const closeElement = () => {};

	const onCategoryChange = useCallback(
		(categories: Category[]) => {
			//TODO: handle category change
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

	const [pcategories, setPostCategories] = useState<Record<number, Category>>({});

	useEffect(() => {
		async function go() {
			try {
				let pcat: PostCategories[] = [];
				try {
					pcat = await postCategories.GetPostCategories(post.id);
				} catch (err) {
					console.error(err);
				}

				const cats = (
					await Promise.allSettled(
						pcat.map((postCategory) => catContext.GetCategory(postCategory.category_id))
					)
				)
					.filter((promise) => promise.status === 'fulfilled')
					.map((promise) => promise.value)
					.filter(Boolean);

				setPostCategories(ObjectFormat.toObj(cats.filter(Boolean) as Category[], 'id'));

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

	const updatePo = () => {
		alert('todo: server side post');
		// dispatch(serverSavePost(currPost));
	};

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
				<RenderCategories categories={Object.values(pcategories)} />
				<Divider borderWidth={'2px'} mt={3} />
			</Box>
			<Box display={'flex'} justifyContent={'right'}>
				<ButtonGroup>
					<LikeButton size={'sm'} />
					{isCreator ? (
						<>
							<ModalComponent
								color={'purple'}
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
									categories={Object.values(pcategories)}
									post={post}
									onChange={onChange}
									onCategoryChange={onCategoryChange}
								/>

								<SelectFolder
									baseFolders={folders}
									onChange={}
									defaultSelected={post.parent}
								/>
							</ModalComponent>
							<Skeleton borderRadius={'12px'} isLoaded={Boolean(post.title) || false}>
								<ModalComponent
									color={'red'}
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
											Are you sure you want to delete this?
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
