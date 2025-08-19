import { Box, BoxProps } from '@chakra-ui/react';
import { BASEURL } from '../../utils/formatting/utils';
import { RenderTag } from '../RenderTag';

type CategoryListProps = {
	id?: number;
	name?: string;
	color?: string;
} & BoxProps;

export const CategoryTag = ({ id = undefined, name = '', color = '', ...props }: CategoryListProps) => {
	return (
		<Box w={'fit-content'} {...props}>
			<a href={`${BASEURL}/categories/${id}`}>
				<RenderTag text={name} color={color} variant={'outline'} />
			</a>
		</Box>
	);
};
