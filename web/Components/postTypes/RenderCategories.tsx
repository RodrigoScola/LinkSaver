import { Flex, FlexProps } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import { Category } from 'shared';
import { RenderTag } from '../RenderTag';

type RenderCategoriesProps = {
	categories: Category[];

	onCategoryClick?: (category: Category) => void;
} & FlexProps;

export const RenderCategories = ({ categories, onCategoryClick = () => {}, ...rest }: RenderCategoriesProps) => {
	const renderedTags = useMemo(
		() =>
			categories?.map((category: Category, idx: number) => (
				<RenderTag
					onClick={() => onCategoryClick(category)}
					key={idx}
					color={category?.color}
					text={category.name}
				/>
			)),
		[categories]
	);

	return (
		<Flex wrap='wrap' gap={1} {...rest}>
			{renderedTags}
		</Flex>
	);
};
