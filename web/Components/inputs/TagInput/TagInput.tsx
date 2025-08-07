import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
	const [rendrCount, setRenderCount] = useState(0);

	const changeItem = useCallback(
		(id: number) => {
			const item = allTags.find((predicate) => predicate.id === id);

			if (!item) {
				console.error('Item not found with id:', id);
				return;
			}

			item.isSelected = !item.isSelected;

			onItemChange?.(item);

			onSelectChange?.(allTags);

			setRenderCount((prev) => prev + 1);
		},
		[onItemChange, allTags]
	);

	return (
		<Flex justifyContent={'center'} gap={3} {...props} wrap={'wrap'}>
			{allTags?.map((item, idx) => {
				return (
					<RenderTag
						size={'md'}
						m={1}
						shadow={item?.isSelected ? 'inset 2px -2px' : 'inset -2px 2px'}
						colorScheme={item?.isSelected ? item.color : 'blue'}
						variant={item?.isSelected ? 'solid' : 'outline'}
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
