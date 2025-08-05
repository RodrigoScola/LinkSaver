import { Heading, SimpleGrid, TagProps } from '@chakra-ui/react';

import { useQuery } from '@tanstack/react-query';
import { RenderHead } from '../../Components/RenderHead';
import { GridItem } from '@chakra-ui/react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { getData } from '../../class/serverBridge';
import { useEffect, useMemo, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { AddIcon } from '@chakra-ui/icons';
import formatter from '../../utils/formatting/formatting';
import _ from 'lodash';
import { TagInput } from '../../Components/inputs/TagInput/TagInput';
import { FolderCard } from '../../Components/cards/folderCard';
import { FolderProvider } from '../../context/FolderContext';
import { usePosts } from '../../hooks/usePosts';
import { useFolders } from '../../hooks/useFolder';
import folders from '../folders';
import { $ } from 'bun';
import { count } from 'console';

const user = {
	id: -1,
	post_count: 0,
	username: 'rodrigo',
};

const options = {
	postStep: 5,
};

export default function USERNAMEPAGE({}) {
	const categoryCtx = useCategories();
	const [selectedTags, setSelectedTags] = useState([]);

	const postCtx = usePosts();

	const folderCtx = useFolders();

	const posts = useQuery({
		queryKey: ['posts', user.id],
		queryFn: () =>
			getData.get(
				`/posts/?count=8&user_id=${user.id}&order=desc&from=${Object.values(postCtx.Posts()).length}`
			),
		refetchOnWindowFocus: false,
	});
	const folders = useQuery({
		queryKey: ['posts', user.id],
		queryFn: () =>
			getData.get(
				`/folders/?count=${options.postStep + Object.values(postCtx.Posts()).length}&user_id=${
					user.id
				}&order=desc`
			),
		refetchOnWindowFocus: false,
		initialData: [],
	});

	const categories = useQuery({
		queryKey: ['posts', user.id],
		queryFn: () =>
			getData.get(
				`/folders/?count=${options.postStep + Object.values(postCtx.Posts()).length}&user_id=${
					user.id
				}&order=desc`
			),
		refetchOnWindowFocus: false,
		initialData: [],
	});

	useEffect(() => {
		for (const folder of folders.data) folderCtx.AddFolder(folder);
	}, [folders.data]);

	useEffect(() => {
		for (const post of posts.data) postCtx.AddPost(post);
	}, [posts.data]);

	useEffect(() => {
		for (const post of categories.data) categoryCtx.AddCategory(post);
	}, [posts.data]);

	return (
		<Box>
			<RenderHead title={'User ' + formatter.str.capitalize(user?.username)} />
			{/* <UserCard {...user} postCount={Math.max(user?.post_count, 0)} /> */}

			{Object.values(folderCtx.GetFolders()).length == 0 && posts.data.length == 0 && (
				<Box>
					<Heading textAlign={'center'}>There doesnt seem to have any posts here yet!</Heading>
				</Box>
			)}

			<SimpleGrid spacingX={'40px'} spacingY={'20px'} columns={10} minChildWidth={'100px'}>
				{Object.values(folderCtx.GetFolders())?.map((item, ind) => {
					return (
						<FolderProvider key={ind} baseFolder={item}>
							<FolderCard />
						</FolderProvider>
					);
				})}
				{Object.values(folderCtx.GetFolders()).length !== 0 && (
					<GridItem display={'flex'} alignItems={'center'}>
						<Button onClick={() => folders.refetch()} variant={'outline'} borderRadius='50%'>
							<AddIcon /> Load More
						</Button>
					</GridItem>
				)}
			</SimpleGrid>
			{categories.data.length > 0 && (
				<TagInput
					py={3}
					gap={2}
					justifyItems={'center'}
					// w={"100%"}
					onSelectChange={setSelectedTags}
					name={'selectnewitem'}
					totalTags={categories.data}
				/>
			)}

			{/* <SimpleGrid pb={8} minChildWidth={'200px'} justifySelf={'center'} gap={4}>
				{posts.data?.map((post: Post, idx) => {
					if (
						post?.categories?.some((item) => selectedTags.includes(item)) ||
						selectedTags.length == 0
					)
						return (
							<GridItem key={'post-id' + idx}>
								<PostProvider post={post}>
									<PostCard />
								</PostProvider>
							</GridItem>
						);
				})}
			</SimpleGrid> */}
			{posts.data.length < user?.post_count ? (
				<Flex justifyContent={'center'}>
					<Button
						w={'50%'}
						colorScheme={'pink'}
						shadow={'-3px 3px'}
						size={'lg'}
						rounded={'3xl'}
						//TODO: PROB HAS A BUG
						onClick={() => posts.refetch()}>
						Load More
					</Button>
				</Flex>
			) : null}
		</Box>
	);
}
