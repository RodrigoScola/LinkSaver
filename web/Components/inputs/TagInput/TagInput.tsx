import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';
import { RenderTag } from '../../RenderTag';

type TagProps = {
	name: string;
	isSelected: boolean;
	id: number;
	color: string;
};

type TagInputProps = {
	name: string;

	totalTags: TagProps[];
	onSelectChange: (item: any) => void;
	onItemChange?: (item: any) => void;
} & FlexProps;

export const TagInput = ({
	name,
	totalTags: allTags = [],
	onSelectChange = () => {},
	onItemChange = () => {},
	...props
}: TagInputProps) => {
	const selectedItems = useMemo(() => allTags.filter((item) => item.isSelected), [allTags]);

	const changeItem = useCallback(
		(id: number) => {
			const item = allTags.find((predicate) => predicate.id === id);

			if (!item) {
				console.error('Item not found with id:', id);
				return;
			}
			//TODO: check if theres a bug when selecting this

			item.isSelected = !item.isSelected;

			onItemChange?.(item);
		},
		[onItemChange, allTags]
	);

	useEffect(() => {
		onSelectChange(selectedItems);
	}, [selectedItems, onSelectChange]);

	return (
		<Flex justifyContent={'center'} gap={3} {...props} wrap={'wrap'}>
			{allTags?.map((item, idx) => {
				return (
					<RenderTag
						size={'md'}
						m={1}
						shadow={item?.isSelected ? 'inset 2px -2px' : 'inset -2px 2px'}
						colorScheme={'blue'}
						variant={'outline'}
						key={idx + 'tagItemInput + name' + name}
						onClick={() => {
							changeItem(item.id);
						}}
						color={item?.isSelected == true ? (item?.color ? item?.color : 'green') : 'gray'}
						text={item?.name}></RenderTag>
				);
			})}
		</Flex>
	);
};
