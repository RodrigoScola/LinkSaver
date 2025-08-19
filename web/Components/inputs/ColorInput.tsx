import { Box, BoxProps, Input } from '@chakra-ui/react';

import { FormInput } from './FormInput';
import { ReactNode, useEffect, useState } from 'react';

export type ColorProps = {
	hasInput?: boolean;

	children?: ReactNode;
	defaultValue: string;

	size?: string;

	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

	id?: string;
	name?: string;
	ref?: React.RefObject<HTMLInputElement> | null;
} & BoxProps;

export const ColorInput = ({
	hasInput = false,
	name,
	ref = null,
	onChange = () => {},
	defaultValue,
	children,
	size,
	...props
}: ColorProps) => {
	const [currentValue, setCurrentValue] = useState<string>(defaultValue);

	const changeColorCode = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentValue(e.target.value);
		if (onChange) {
			onChange?.(e);
		}
	};

	return (
		<Box minW={'100px'} maxW={size}>
			<Box overflow={'hidden'} height={size} {...props}>
				<Input
					cursor={'pointer'}
					defaultValue={defaultValue}
					name={name}
					id={name}
					onChange={changeColorCode}
					ref={ref}
					type={'color'}
					padding={0}
					width={'150%'}
					height={'150%'}
					margin={'-25%'}
				/>
			</Box>
			{hasInput == true ? (
				<FormInput>
					<Input value={currentValue} onChange={changeColorCode} />
				</FormInput>
			) : null}
			<Box>
				<label htmlFor={'colorInput'}>{children}</label>
			</Box>
		</Box>
	);
};
