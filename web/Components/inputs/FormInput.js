import { FormControl, FormHelperText, FormLabel, Box } from "@chakra-ui/react"

export const FormInput = ({ isError = false, labelText, HelperText, ErrorMessage, children, ...rest }) => {
	return (
		<FormControl width={"fit-content"} {...rest}>
			<FormLabel>{labelText}</FormLabel>
			{children}
			<Box>
				{isError == true ? (
					<FormHelperText color={"red"}>{ErrorMessage}</FormHelperText>
				) : (
					<FormHelperText>{HelperText}</FormHelperText>
				)}
			</Box>
		</FormControl>
	)
}
