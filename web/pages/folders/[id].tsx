import { getData } from '../../class/serverBridge';
import { Box, Center, Heading, Grid, Flex } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { PostProvider } from '../../context/PostContext';
import { PostCard } from '../../Components/cards/PostCard';
import { usePosts } from '../../hooks/usePosts';
import formatter from '../../utils/formatting/formatting';
import { BoxCard } from '../../Components/cards/BoxCard';
import { RenderHead } from '../../Components/RenderHead';
import { Folder, Post } from 'shared';
import { AsyncQueue } from '../../class/AsyncQueue';
import { BoxCardOutline } from '../../Components/cards/BoxCardOutline';
import { FolderCard } from '../../Components/cards/folderCard';
import { FolderProvider } from '../../context/FolderContext';
import { useFolders } from '../../hooks/useFolder';

// { folder: baseFolder, posts: basePosts }: { folder: Folder; posts: Post[] }

export default function FOLDERID(p: { folderId: number }) {
	const [baseFolder, setCurrFolder] = useState<Folder | null>();

	const pcont = usePosts();
	const fContext = useFolders();

	useEffect(() => {
		async function go() {
			const queue = new AsyncQueue();

			queue.Add('folder', getData.get(`/folders/${p.folderId}`));

			queue.Add('folders', getData.get(`/folders/?parent_folder=${p.folderId}`));

			queue.Add('posts', getData.get(`/posts/?parent=${p.folderId}`));

			await queue.Build();

			console.log('queue results', queue.results);

			setCurrFolder(queue.GetResult('folder') as Folder);

			const foldersResult = queue.GetResult('folders');
			const foldersArr = Array.isArray(foldersResult) ? foldersResult : [];
			console.log({ foldersArr });
			for (const folders of foldersArr) {
				fContext.AddFolder(folders);
			}

			const postsResult = queue.GetResult('posts');
			const postsArray = Array.isArray(postsResult) ? postsResult : [];
			for (const post of postsArray) {
				pcont.AddPost(post);
			}
		}

		go();
	}, [p.folderId]);

	return (
		<Box>
			<RenderHead title={'Folder: ' + baseFolder?.title} />
			<Box pb={3}>
				<Center>
					<BoxCard color={baseFolder?.color}>
						<Heading textAlign={'center'} color={baseFolder?.color}>
							{formatter.str.capitalize(baseFolder?.title)}
						</Heading>
					</BoxCard>
				</Center>
			</Box>

			{fContext.GetFolders().length > 0 && (
				<Box pt={3}>
					<BoxCardOutline>
						<Heading textAlign={'center'}>Folders</Heading>
					</BoxCardOutline>

					<Flex py={6} justifyContent={'space-around'}>
						{fContext.GetFolders()?.map((item) => {
							return (
								<FolderProvider key={item.id} baseFolder={item}>
									<FolderCard />
								</FolderProvider>
							);
						})}
					</Flex>
				</Box>
			)}
			{Object.values(pcont.Posts()).length > 0 && (
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
							Files
						</Heading>
					</BoxCard>
					<Grid pt={10} gridTemplateColumns={'repeat(4, 1fr)'} rowGap={5} columnGap={7}>
						{Object.values(pcont.Posts())?.map((post, index) => {
							return (
								<PostProvider key={index} post={post}>
									<PostCard />
								</PostProvider>
							);
						})}
					</Grid>
				</Box>
			)}
			{/* {basePosts.length == 0 && folder.length == 0 && (
				<Box>
					<Heading textAlign={'center'}>There doesnt seem to have any posts here yet!</Heading>
				</Box>
			)} */}
		</Box>
	);
}

export async function getServerSideProps(context: any) {
	console.log(context.params);
	const { id } = context.params;

	return {
		props: {
			folderId: parseInt(id),
		},
	};
}
