import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useFolder } from '../../context/FolderContext';
import { PopoverElement } from '../ui/popover/PopoverElement';
import { EditIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { NewFolderCard } from './newFolderCard';
import { useFolders } from '../../hooks/useFolder';
import { Folder } from 'shared';
import { useObject } from '../../hooks/useObject';
import { useUsers } from '../../hooks/useUser';

export const FolderCard = () => {
	const router = useRouter();

	const user = useUsers();

	const fs = useFolders();

	const { folder: baseFolder, isCreator } = useFolder();
	const [hovering, setHovering] = useState(false);
	const [editing, setEditing] = useState(false);

	const { value, update } = useObject(baseFolder);

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(`updating`, e.target.name, e.target.value);
		update({ [e.target.name]: e.target.value });
	}, []);

	const onClick = () => router.push(`/folders/${baseFolder?.id}`);

	const [otherFolders, setOtherFolders] = useState<Folder[]>([]);

	const updateFolder = useCallback(async () => {
		console.log(value.color);
		if (!value.title || !value.color) {
			console.error(`cannot update`);
			console.error(`title: ${value.title}`);
			console.error(`color: ${value.color}`);
			return;
		}

		const updatedFolder = await fs.UpdateFolder(value);

		if (!updatedFolder) {
			console.error(`cannot update folder`);
			return;
		}

		console.log(`updating folde`, updatedFolder);

		// update(updatedFolder);
		setHovering(false);
		setEditing(false);
	}, [value]);

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

	// useEffect(() => setHovering(true), []);

	return (
		<Flex
			onMouseEnter={() => {
				setHovering(true);
			}}
			onMouseLeave={() => {
				if (!editing) {
					setHovering(false);
				}
			}}
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
			{/* <a href={'/folders/' + baseFolder?.id}> */}
			<Heading onClick={onClick} overflowWrap={'anywhere'} size={'lg'}>
				{baseFolder?.title}
			</Heading>
			{/* </a> */}
			{user.loggedIn && hovering && isCreator(user.user.id) ? (
				<Box
					// onClick={}
					position={'absolute'}
					top={0}
					right={'0'}
					zIndex={100}>
					<PopoverElement
						closeOnEsc={true}
						onOpen={() => setEditing(true)}
						triggerElement={<IconButton aria-label='' icon={<EditIcon />} />}>
						<NewFolderCard
							onSubmit={updateFolder}
							folder={baseFolder}
							type='update'
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
