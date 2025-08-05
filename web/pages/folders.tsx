import { FolderProvider } from '../context/FolderContext';
import { FolderCard } from '../Components/cards/folderCard';
import { Flex, Text } from '@chakra-ui/react';
import { Suspense, useEffect, useState } from 'react';
import { useFolders } from '../hooks/useFolder';
import { RenderHead } from '../Components/RenderHead';
import { Folder } from 'shared';

export default function FoldersPage() {
	const fs = useFolders();

	const [folders, setFolders] = useState<Folder[]>([]);

	useEffect(() => {
		const go = async () => {
			const fetchedFolders = await fs.GetFolders();
			setFolders(fetchedFolders);
		};
		go();
	}, []);

	return (
		<>
			<RenderHead title={'Folders'} />
			<Flex wrap={'wrap'} justifyContent={'space-evenly'}>
				{folders.length > 0 &&
					folders.map((folder, i) => (
						<Suspense key={'folder' + i} fallback={<Text>Loading</Text>}>
							<FolderProvider folder={folder}>
								<FolderCard />
							</FolderProvider>
						</Suspense>
					))}
			</Flex>
		</>
	);
}
