import { BoxCard } from './cards/BoxCard';
import { Flex, useOutsideClick } from '@chakra-ui/react';
import { PostProvider } from '../context/PostContext';
import { FolderProvider } from '../context/FolderContext';
import { AiOutlineTag } from 'react-icons/ai';
import { FolderTag } from './List/FolderList';
import { SearchInput } from './inputs/SearchInput';
import { Box } from '@chakra-ui/react';
import { useCategories } from '../hooks/useCategories';
import { useFolders } from '../hooks/useFolder';
import { usePosts } from '../hooks/usePosts';

import { PostList } from './List/PostList';

import { VscFolder } from 'react-icons/vsc';
import { useCallback, useMemo, useRef, useState } from 'react';

import { CategoryTag } from './List/CategoryList';
import { newFolder, newPost } from '../utils/formatting/utils';
import { Category, Folder, Post } from 'shared';
export const NavSearch = () => {
	const catContext = useCategories();
	const folderCtx = useFolders();

	const PostCtx = usePosts();
	const handleResults = useCallback(
		(items: Record<string, any>) => {
			if (items[0]) {
				items = items[0];

				for (const category of items?.categories || ([] as Category[])) {
					catContext.AddCategory(category);
				}

				for (const folder of items?.folders || ([] as Folder[])) {
					folderCtx.AddFolder(folder);
				}
				for (const post of items?.posts || ([] as Post[])) {
					PostCtx.AddPost(post);
				}
			}
		},
		[newPost, newFolder]
	);

	const boxRef = useRef(null);

	const [modalOpen, setIsOpen] = useState(false);

	useOutsideClick({
		ref: boxRef,
		handler: () => setIsOpen(false),
	});

	const hasResults = useMemo(() => {
		return (
			folderCtx.GetFolders().length +
				Object.values(PostCtx.Posts()).length +
				catContext.categories.length !==
			0
		);
	}, [folderCtx.GetFolders(), PostCtx.Posts(), catContext.categories]);

	return (
		<Box>
			<Box>
				<Box ref={boxRef} onClick={() => setIsOpen(true)}>
					<SearchInput name='navSearchResults' type='search' onResult={handleResults} />
				</Box>
				{modalOpen == true && hasResults ? (
					<Box ref={boxRef}>
						<BoxCard px={3} mt={4}>
							{folderCtx.GetFolders().length > 0 && (
								<Box>
									<Flex fontWeight={'bold'} alignItems={'center'}>
										<VscFolder /> {/* VscFolderOpened */}
										Folders
									</Flex>
									{folderCtx.GetFolders().map((curr, ind) => {
										return (
											<FolderProvider key={ind} baseFolder={curr}>
												<FolderTag />
											</FolderProvider>
										);
									})}
								</Box>
							)}
							{Object.values(PostCtx.Posts()).length > 0 && (
								<Box>
									<Flex fontWeight={'bold'} alignItems={'center'}>
										<VscFolder /> {/* VscFolderOpened */}
										Files
									</Flex>
									{Object.values(PostCtx.Posts()).map((curr, ind) => {
										return (
											<PostProvider key={ind} post={curr}>
												<PostList />
											</PostProvider>
										);
									})}
								</Box>
							)}

							{catContext.categories.length > 0 && (
								<Box>
									<Flex fontWeight={'bold'} alignItems={'center'}>
										<AiOutlineTag />
										{/* aioutlinetags */}
										Categories
									</Flex>
									<Flex gap={2}>
										{catContext.categories.map((cat, ind) => {
											return <CategoryTag key={ind} {...cat} />;
										})}
									</Flex>
								</Box>
							)}
						</BoxCard>
					</Box>
				) : null}
			</Box>
		</Box>
	);
};
