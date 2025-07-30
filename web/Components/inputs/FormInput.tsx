import { FormControl, FormHelperText, FormLabel, Box, FormControlProps } from "@chakra-ui/react"
import { ReactNode } from 'react';

export const FormInput = ({ isError = false, labelText, HelperText, errorMessage, children, ...rest }: {
	isError?: boolean;
	labelText?: string;
	HelperText?: string;
	errorMessage?: string;
	children?: ReactNode;
} & FormControlProps
) => {
	return (
		<FormControl width={"fit-content"} {...rest}>
			{labelText && <FormLabel>{labelText}</FormLabel>}
			{children}
			<Box>
				{isError == true ? (
					<FormHelperText color={"red"}>{errorMessage}</FormHelperText>
				) : (
					<FormHelperText>{HelperText}</FormHelperText>
				)}
			</Box>
		</FormControl>
	)
}
