import { Heading, SimpleGrid } from '@chakra-ui/react';
import { RenderHead } from '../../Components/RenderHead';
import { GridItem } from '@chakra-ui/react';
import { useFolder } from '../../hooks/useFolder';
import { Box, Button, Flex } from '@chakra-ui/react';
import { getData } from '../../class/serverBridge';
import { usePosts } from '../../hooks/usePosts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { obj } from '../../utils/formatting/ObjectFormat';
import { AddIcon } from '@chakra-ui/icons';
import { useLoadMore } from '../../hooks/useLoadmore';
import { UserCard } from '../../Components/cards/UserCard';
import formatter from '../../utils/formatting/formatting';
import _ from 'lodash';
import dynamic from 'next/dynamic';

import { TagInput } from '../../Components/inputs/TagInput/TagInput';
import { PostProvider } from '../../context/PostContext';
import { FolderCard } from '../../Components/cards/folderCard';
import { FolderProvider } from '../../context/FolderContext';
import { PostCard } from '../../Components/cards/PostCard';
export default function USERNAMEPAGE({ user }) {
	const { posts, newPost } = usePosts([]);
	const { categories, ids, setNewIds } = useCategories([]);
	const { folder, newFolder } = useFolder([]);
	const [selectedTags, setSelectedTags] = useState([]);
	const handleSelectTag = useCallback(
		(items) => {
			const ids = obj.getUniques(items, 'id');
			setSelectedTags(ids);
		},
		[setSelectedTags]
	);

	const { data, loadMore } = useLoadMore(`posts/?count=8&user_id=${user.id}&order=desc`, {
		step: 5,
		persists: true,
	});

	const { data: folderData, loadMore: handleMoreFolders } = useLoadMore(
		`folders/?count=5&user_id=${user.id}`,
		{
			step: 5,
		}
	);

	useEffect(() => {
		if (data) {
			const catIds = new Set();
			data?.reverse().forEach((item) => {
				newPost(item);
				if (item.categories) {
					item.categories.map((item) => catIds.add(item));
				}
			});
			setNewIds([...catIds]);
		}
	}, [data, newPost]);
	useEffect(() => {
		if (folderData) {
			const folderIds = obj.getUniques(folder, 'id');
			const dataIds = obj.getUniques(folderData, 'id');
			if (dataIds.some((id) => !folderIds.includes(id))) {
				folderData.map((item) => {
					return newFolder(item);
				});
			}
		}
	}, [folderData, folder, newFolder]);

	const showFolders = useMemo(() => {
		return _.uniqBy(folder, 'id').sort((a, b) => a.id - b.id);
	}, [folder]);
	return (
		<Box>
			<RenderHead title={'User ' + formatter.str.capitalize(user?.username)} />
			<UserCard {...user} postCount={Math.max(user?.post_count, 0)} />

			{showFolders.length == 0 && posts.length == 0 && (
				<Box>
					<Heading textAlign={'center'}>There doesnt seem to have any posts here yet!</Heading>
				</Box>
			)}

			<SimpleGrid spacingX={'40px'} spacingY={'20px'} columns={10} minChildWidth={'100px'}>
				{showFolders?.map((item, ind) => {
					return (
						<FolderProvider key={ind} folder={item}>
							<FolderCard />
						</FolderProvider>
					);
				})}
				{showFolders.length !== 0 && (
					<GridItem display={'flex'} alignItems={'center'}>
						<Button onClick={handleMoreFolders} variant={'outline'} borderRadius='50%'>
							<AddIcon /> Load More
						</Button>
					</GridItem>
				)}
			</SimpleGrid>
			{categories.length > 0 && (
				<TagInput
					py={3}
					gap={2}
					justifyItems={'center'}
					// w={"100%"}
					onSelectChange={handleSelectTag}
					name={'selectnewitem'}
					totalTags={categories}
				/>
			)}

			<SimpleGrid pb={8} minChildWidth={'200px'} justifySelf={'center'} gap={4}>
				{posts?.map((post, idx) => {
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
			</SimpleGrid>
			{posts.length < user?.post_count ? (
				<Flex justifyContent={'center'}>
					<Button
						w={'50%'}
						colorScheme={'pink'}
						shadow={'-3px 3px'}
						size={'lg'}
						rounded={'3xl'}
						onClick={loadMore}>
						Load More
					</Button>
				</Flex>
			) : null}
		</Box>
	);
}
export const getStaticPaths = async () => {
	const ids = await getData.getData('/users/?select=id');
	const paths = ids.map((username) => {
		username = String(username);
		return {
			params: { username: username },
		};
	});
	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps = async ({ params }) => {
	const user = await getData.getPost('users', params.username + '/?extended=true&order=desc');
	return {
		props: { user },
	};
};
