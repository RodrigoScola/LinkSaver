import { getData } from '../../class/serverBridge';
import { useFolder } from '../../hooks/useFolder';
import { Box, Center, Heading, Grid } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FolderProvider } from '../../context/FolderContext';
import { FolderCard } from '../../Components/cards/folderCard';
import { PostProvider } from '../../context/PostContext';
import { PostCard } from '../../Components/cards/PostCard';
import { usePosts } from '../../hooks/usePosts';
import formatter from '../../utils/formatting/formatting';
import { BoxCard } from '../../Components/cards/BoxCard';
import { BoxCardOutline } from '../../Components/cards/BoxCardOutline';
import { RenderHead } from '../../Components/RenderHead';
import { Folder, Post } from 'shared';

// { folder: baseFolder, posts: basePosts }: { folder: Folder; posts: Post[] }

export default function FOLDERID(p) {
	const [baseFolder, setCurrFolder] = useState<Folder | null>();

	const pcont = usePosts();

	useEffect(() => {
		async function go() {
			const folderData = await getData.getData(`/folders/${p.folderId}`);

			setCurrFolder(folderData);

			const posts = await getData.getData(`/posts/?parent=${p.folderId}`);

			for (const post of posts) {
				pcont.AddPost(post);
			}
		}

		go();
	}, [p.folderId]);

	// const postCtx = usePosts();
	// const { folder } = useFolder([]);
	// useEffect(() => {
	// 	console.log('adding');
	// 	for (const post of basePosts) {
	// 		postCtx.AddPost(post);
	// 	}
	// }, [baseFolder]);

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
			{/* {folder.length > 0 && (
				<Box pt={3}>
					<BoxCardOutline>
						<Heading textAlign={'center'}>Folders</Heading>
					</BoxCardOutline>

					<Box>
						{folder?.map((item) => {
							return (
								<FolderProvider key={item.id} folder={item}>
									<FolderCard />
								</FolderProvider>
							);
						})}
					</Box>
				</Box>
			)} */}
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
						direction='default'
						w={'fit-content'}
						margin={'auto'}
						px={'5'}
						color={'ActiveBorder'}>
						<Heading color={'ActiveBorder'} textAlign={'center'}>
							Recent Files
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

export const getServerSideProps = async (context) => {
	return {
		props: {
			folderId: Number(context.params.id),
		},
	};
};
