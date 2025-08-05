import { Box, Button, Input, Flex, Divider, Heading, color } from '@chakra-ui/react';
import { FormInput } from '../inputs/FormInput';
import { ItemColorSelect } from '../inputs/ItemColorSelect';
import { RenderTag } from '../RenderTag';
import { VscNewFolder } from 'react-icons/vsc';
import formatter from '../../utils/formatting/formatting';
import { SearchInput } from '../inputs/SearchInput';
import { useFolders } from '../../hooks/useFolder';
import { FolderListInput } from '../List/FolderListInput';
import { useCallback, useEffect, useState } from 'react';
import { Folder } from 'shared';

type NewFolderCardProps = {
	folder?: Folder;
	folders: Folder[];
	parent_folder?: Folder;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit?: () => void;
	onParentFolderChange?: (folder: Folder) => void;
	type?: 'create' | 'update';
};

export const NewFolderCard = ({
	folder,
	onParentFolderChange = () => {},
	folders,
	onChange: handleChange = () => {},
	onSubmit: onSubmit,
	type = 'create',
}: NewFolderCardProps) => {
	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleChange(e);
		},
		[handleChange]
	);

	const folderContext = useFolders();

	const handleResult = (folders: Folder[]) => {
		for (const folder of folders) folderContext.AddFolder(folder);
	};

	return (
		<>
			<Box color={'black'}>
				<Flex alignContent={'center'} alignItems={'center'} justifyContent={'space-between'}>
					<FormInput
						HelperText={'what is the folder name?'}
						labelText={'Folder Name'}
						errorMessage={'invalid folder name'}>
						<Input
							placeholder='Default Folder Name'
							value={folder?.title}
							maxLength={15}
							name='name'
							onChange={onChange}
							mt={1}
							justifySelf={'right'}
						/>
					</FormInput>

					<ItemColorSelect
						name={'color'}
						HelperText={'Color Code'}
						labelText={'Folder Color'}
						pl={3}
						defaultValue={folder?.color || ''}
						onChange={onChange}
					/>
				</Flex>
				<Divider pt={3} mb={3} />
				<Flex columnGap={3} flexDir='column'>
					<Heading pb={1} size={'sm'}>
						Parent Folder
					</Heading>
					<FolderListInput folders={folders} onFolderChange={onParentFolderChange} />
					<SearchInput name={'folderSearchResult'} type='folders' onResult={handleResult} />
				</Flex>
				<Flex justifyContent={'center'} m={'auto'} pt={2} mb={4}>
					<RenderTag color={folder?.color} size='lg'>
						{folder?.title}
					</RenderTag>
				</Flex>

				<Flex mb={2} justifyContent={'center'}>
					<Button
						shadow={formatter.color.shadows.left}
						onClick={onSubmit}
						leftIcon={<VscNewFolder />}
						colorScheme={'whatsapp'}>
						{type == 'update' ? 'update folder' : 'add new folder'}
					</Button>
				</Flex>
			</Box>
		</>
	);
};
