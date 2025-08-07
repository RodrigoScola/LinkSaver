import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useFolder } from '../../context/FolderContext';
import { PopoverElement } from '../ui/popover/PopoverElement';
import { EditIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import e from 'express';
import { NewFolderCard } from './newFolderCard';
import { useFolders } from '../../hooks/useFolder';
import { Folder } from 'shared';
import { useObject } from '../../hooks/useObject';

export const FolderCard = () => {
	const router = useRouter();

	const fs = useFolders();

	const { folder: baseFolder, isCreator } = useFolder();
	const [hovering, setHovering] = useState(false);

	const { value, update } = useObject(baseFolder);

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		update({ [e.target.name]: e.target.value });
	}, []);

	const onClick = () => router.push(`/folders/${baseFolder?.id}`);

	const [otherFolders, setOtherFolders] = useState<Folder[]>([]);

	const updateFolder = useCallback(async () => {
		if (!value.title || !value.color) {
			return;
		}

		const updatedFolder = await fs.UpdateFolder(value);

		if (!updatedFolder) {
			return;
		}

		update(updatedFolder);
	}, []);

	const onParentFolderChange = useCallback(
		(folder: Folder) => {
			update({ parent_folder: folder.id });
		},
		[update]
	);

	useEffect(() => {
		const fetchFolders = async () => {
			const folders = await fs.GetFolders();
			setOtherFolders(folders);
		};

		fetchFolders();
	}, []);

	return (
		<Flex
			onClick={onClick}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			position={'relative'}
			shadow={`-5px 5px ${baseFolder?.color} `}
			flexDir={'column'}
			alignItems={'center'}
			justifyContent={'center'}
			maxW={'300px'}
			p={2}
			color={baseFolder?.color}
			border={'2px'}
			borderRadius={'10px'}
			minHeight={'100px'}
			minW={'105px'}>
			<a href={'/folders/' + baseFolder?.id}>
				<Heading overflowWrap={'anywhere'} size={'lg'}>
					{baseFolder?.title}
				</Heading>
			</a>
			{hovering && isCreator ? (
				<Box position={'absolute'} top={0} right={'0'}>
					<PopoverElement triggerElement={<IconButton aria-label='' icon={<EditIcon />} />}>
						<NewFolderCard
							onSubmit={updateFolder}
							folder={baseFolder}
							onParentFolderChange={onParentFolderChange}
							onChange={handleChange}
							folders={otherFolders}
						/>
					</PopoverElement>
				</Box>
			) : null}
		</Flex>
	);
};
