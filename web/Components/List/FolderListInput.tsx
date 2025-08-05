import { RadioGroup, Radio, ListItem, List, RadioGroupProps } from '@chakra-ui/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';

import { ObjectFormat } from '../../utils/formatting/ObjectFormat';
import { Folder, OmitBy } from 'shared';

export const FolderListInput = ({
	folders = [],
	onFolderChange: onFolderChange,
	defaultSelected: selectedItem,

	...props
}: {
	folders: Folder[];
	onFolderChange: (folder: Folder) => void;
	children?: ReactNode;
	defaultSelected?: Folder;
} & OmitBy<RadioGroupProps, 'children'>) => {
	const [selected, setSelected] = useState<Folder | undefined>(selectedItem);

	const handleChange = useCallback(
		(id: string) => {
			const folderObj = ObjectFormat.toObj(folders, 'id');
			const item = folderObj[Number(id)];

			if (item) {
				setSelected(item);
			}
		},
		[folders, setSelected]
	);
	useEffect(() => {
		if (selectedItem) {
			handleChange(selectedItem.id.toString());
		}
	}, [selectedItem, handleChange]);

	useEffect(() => {
		if (selected) {
			onFolderChange(selected);
		}
	}, [selected]);

	return (
		<RadioGroup
			{...props}
			onChange={handleChange}
			defaultValue={String(selectedItem?.id)}
			value={String(selected?.id)}>
			<List>
				{folders?.map((folder, i) => {
					return (
						<ListItem key={i} listStyleType={'none'}>
							<Radio value={String(folder.id)}>{folder.title}</Radio>
						</ListItem>
					);
				})}
			</List>
		</RadioGroup>
	);
};
