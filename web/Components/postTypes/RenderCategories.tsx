import { Flex, FlexProps } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { isDifferent } from '../../utils/formatting/utils';

import { Category } from 'shared';
import { RenderTag } from '../RenderTag';

type RenderCategoriesProps = {
	categories: Category[];
} & FlexProps;

export const RenderCategories = ({ categories, ...rest }: RenderCategoriesProps) => {
	const renderedTags = useMemo(
		() =>
			categories?.map((category: Category, idx: number) => (
				<RenderTag key={idx} color={category?.color} text={category?.name} />
			)),
		[categories]
	);

	return (
		<Flex wrap='wrap' gap={1} {...rest}>
			{renderedTags}
		</Flex>
	);
};
