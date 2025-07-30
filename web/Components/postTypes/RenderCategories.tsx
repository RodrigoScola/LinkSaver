import { Flex } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { isDifferent } from '../../utils/formatting/utils';

import { Category } from 'shared';
import { RenderTag } from '../RenderTag';
export const RenderCategories = ({ categories, ...rest }) => {
	const renderedTags = useMemo(() => {
		return categories?.map((category: Category, cat_key) => (
			<RenderTag key={cat_key} color={category?.color} text={category?.name} />
		));
	}, [categories]);

	return (
		<Flex wrap='wrap' gap={1} {...rest}>
			{renderedTags}
		</Flex>
	);
};
