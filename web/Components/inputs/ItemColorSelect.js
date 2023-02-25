import { Box } from "@chakra-ui/react"
import { FormInput } from "./FormInput"
import { ColorInput } from "./ColorInput"
export const ItemColorSelect = ({
	onChange = () => {},
	children,
	labelText,
	name,
	HelperText,
	size = "3em",
	defaultValue,
	...rest
}) => {
	return (
		<Box {...rest}>
			<FormInput labelText={labelText} HelperText={HelperText}>
				<ColorInput defaultValue={defaultValue} onChange={onChange} name={name} size={size} />
			</FormInput>
			<label
				style={{
					width: "fit-content",
					height: "fit-content",
				}}
				htmlFor={name}
			>
				{children}
			</label>
		</Box>
	)
}
