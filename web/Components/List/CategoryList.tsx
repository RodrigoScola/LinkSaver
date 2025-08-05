import { Box } from '@chakra-ui/react';
import { BASEURL } from '../../utils/formatting/utils';
import { RenderTag } from '../RenderTag';

type CategoryListProps = {
	id?: number | null;
	name?: string;
	color?: string;
};

export const CategoryList = ({ id = null, name = '', color = '' }: CategoryListProps) => {
	return (
		<Box w={'fit-content'}>
			<a href={`${BASEURL}/categories/${id}`}>
				<RenderTag text={name} color={color} variant={'outline'} />
			</a>
		</Box>
	);
};
