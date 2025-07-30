import { useMemo } from 'react';
import { BoxCard } from './BoxCard';
export const BoxCardOutline = ({ children, width = '5px', ...props }) => {
	const w = useMemo(() => Number(width.replace(/[^0-9]/gi, '')), [width]);

	return (
		<BoxCard
			_hover={{
				borderWidth: w * (w / 3),
				transitionDuration: '0.2s',
				transitionTimingFunction: 'ease-in-out',
			}}
			py={4}
			borderWidth={width}
			direction='default'
			w={'fit-content'}
			margin={'auto'}
			px={'5'}
			{...props}
			color={'ActiveBorder'}>
			{children}
		</BoxCard>
	);
};
