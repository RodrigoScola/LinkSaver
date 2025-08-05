import { ResponsiveValue, Tag, TagProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

type RenderTagProps = {
	text?: string;
	color?: string;
	variant?: ResponsiveValue<'solid' | 'outline' | 'subtle' | (string & {})>;
	children?: ReactNode;
} & TagProps;

export const RenderTag = ({ text, color, children, variant = 'solid', ...rest }: RenderTagProps) => {
	return (
		<Tag
			p={2}
			minW={'fit-content'}
			cursor={'pointer'}
			variant={variant}
			border={'4px'}
			fontWeight={'bold'}
			rounded={'2xl'}
			backgroundColor={variant == 'outline' ? 'transparent' : color}
			borderColor={color}
			color={variant == 'outline' ? color : 'white'}
			{...rest}>
			{text}
			{children}
		</Tag>
	);
};
