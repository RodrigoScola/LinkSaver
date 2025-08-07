import { Box, Heading, Button, Flex } from '@chakra-ui/react';
import { PopoverElement } from '../ui/popover/PopoverElement';
import { FolderListInput } from '../List/FolderListInput';
import { useCallback, useEffect, useState } from 'react';
import { SearchInput } from '../inputs/SearchInput';
import { useFolders } from '../../hooks/useFolder';
import formatter from '../../utils/formatting/formatting';
import { NewFolderCard } from './newFolderCard';
import { Folder } from 'shared';
import { useObject } from '../../hooks/useObject';
import { getData } from '../../class/serverBridge';
import { newFolder } from '../../utils/formatting/utils';

export type SelectFolderProps = {
	baseFolders: Folder[];
	onChange?: (folder: Folder) => void;
	defaultSelected?: Folder;
};

export const SelectFolder = ({ baseFolders, onChange = () => {}, defaultSelected }: SelectFolderProps) => {
	const [selectedFolder, setSelectedFolder] = useState(defaultSelected);

	const fs = useFolders();

	const [folderResult, setFolderResult] = useState<Folder[]>(baseFolders || []);

	const handleResults = useCallback((res: any) => {
		if (!res || !res.length) {
			console.error('No results found', res);
			return;
		}
		setFolderResult(res);
	}, []);
	useEffect(() => {
		async function go() {
			const baseFolders = await getData.get('/folders');

			setFolderResult(baseFolders);
		}
		go();
	}, []);

	const { value, update } = useObject<Folder>(newFolder());

	return (
		<Box width={'100%'}>
			<SearchInput onResult={handleResults} type={'folders'} name={'folderSearchResult'} />
			{folderResult.map((folder, index) => {
				return (
					<Button
						onClick={() => {
							onChange(folder);
							setSelectedFolder(folder);
						}}
						key={'folderResult_' + index}>
						{folder.title}
					</Button>
				);
			})}

			<PopoverElement
				onOpen={() => setSelectedFolder(undefined)}
				style={{
					// marginRight: "1em",
					width: 'fit-content',
				}}
				headerElement={<Heading size={'md'}>New Folder</Heading>}
				triggerStyle={{
					width: 'full',
					display: 'flex',
					justifyContent: 'center',
				}}
				triggerElement={
					<Flex width={'fit-content'} justifyContent={'center'}>
						<Button
							colorScheme={'yellow'}
							shadow={formatter.color.shadows.left}
							mt={4}
							value='new'>
							Create new Folder
						</Button>
					</Flex>
				}>
				<NewFolderCard
					onSubmit={() =>
						fs.CreateFolder(value).then((val) => {
							fs.AddFolder(val);
							setFolderResult((prev) => [...prev, val]);
						})
					}
					folder={value}
					onChange={(e) => update({ [e.target.name]: e.target.value })}
					folders={folderResult}
				/>
			</PopoverElement>
		</Box>
	);
};
