import { Box, Input } from "@chakra-ui/react"

import { FormInput } from "./FormInput"

export const ColorInput = ({
	hasInput = false,
	name,
	ref = null,
	onChange = () => {},
	size = "4em",
	props,
	radius = "50%",
	defaultValue,
	children,
}) => {
	return (
		<Box minW={"100px"} maxW={size}>
			<Box overflow={"hidden"} width={size} height={size} borderRadius={radius} {...props}>
				<Input
					cursor={"pointer"}
					defaultValue={defaultValue}
					name={name}
					id={name}
					onChange={onChange}
					ref={ref}
					type={"color"}
					padding={0}
					width={"150%"}
					height={"150%"}
					margin={"-25%"}
				/>
			</Box>
			{hasInput == true ? (
				<FormInput>
					<Input value={colorCode} onChange={changeValue} />
				</FormInput>
			) : null}
			<Box>
				<label htmlFor={"colorInput"}>{children}</label>
			</Box>
		</Box>
	)
}
