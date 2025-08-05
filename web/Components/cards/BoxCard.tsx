import { Box, BoxProps, useMediaQuery } from '@chakra-ui/react';
import { ReactNode, useMemo } from 'react';

type BoxCardProps = {
	y?: number;
	x?: number;
	direction?: 'left' | 'right' | 'up' | 'down';
	children?: ReactNode;
	color?: string;
} & BoxProps;

export const BoxCard = ({
	direction = 'left',
	color = 'black',
	children,
	x: initialX = 10,
	y: initialY = 10,
	...props
}: BoxCardProps) => {
	const [isSmall] = useMediaQuery('(max-width: 768px)');
	const { x, y } = useMemo(() => {
		switch (direction) {
			case 'left':
				return { x: -initialX, y: initialY };
			case 'right':
				return { x: initialX, y: initialY };
			case 'up':
				return { x: initialX, y: -initialY };
			case 'down':
				return { x: -initialX, y: initialY };
			default:
				return { x: 0, y: 0 };
		}
	}, [direction, initialX, initialY]);

	return (
		<Box
			cursor={'default'}
			_hover={{
				shadow: `${x - 4}px ${y + 5}px ${color}`,
				transitionDuration: '0.2s',
				transitionTimingFunction: 'ease-in-out',
			}}
			py={10}
			outlineColor={color}
			rounded={'3xl'}
			minW={'150px'}
			border={'1px'}
			borderColor={color}
			{...props}
			shadow={`${x}px ${y}px ${color}`}>
			{children}
		</Box>
	);
};
