import { Tag } from "@chakra-ui/react"
export const RenderTag = ({ text, color, children, variant = "solid", ...rest }) => {
	return (
		<Tag
			p={2}
			minW={"fit-content"}
			cursor={"pointer"}
			variant={variant}
			border={"4px"}
			fontWeight={"bold"}
			rounded={"2xl"}
			backgroundColor={variant == "outline" ? "transparent" : color}
			borderColor={color}
			color={variant == "outline" ? color : "white"}
			{...rest}
		>
			{text}
			{children}
		</Tag>
	)
}
