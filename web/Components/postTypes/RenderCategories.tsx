import { Flex, FlexProps } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import { Category } from 'shared';
import { RenderTag } from '../RenderTag';
import { CategoryTag } from '../List/CategoryList';

type RenderCategoriesProps = {
	categories: Category[];

	onCategoryClick?: (category: Category) => void;
} & FlexProps;

export const RenderCategories = ({ categories, onCategoryClick = () => {}, ...rest }: RenderCategoriesProps) => {
	const renderedTags = useMemo(
		() =>
			categories?.map((category: Category, idx: number) => (
				<CategoryTag
					onClick={() => onCategoryClick(category)}
					key={idx}
					name={category.name}
					color={category?.color}
				/>

				// <RenderTag
				// />
			)),
		[categories]
	);

	return (
		<Flex wrap='wrap' gap={1} {...rest}>
			{renderedTags}
		</Flex>
	);
};
