import { Box, useMediaQuery } from "@chakra-ui/react"
import { useMemo } from "react"

export const BoxCard = ({
	direction = "left",
	color = "black",
	children,
	x: initialX = 10,
	y: initialY = 10,
	...props
}) => {
	const [isSmall] = useMediaQuery("(max-width: 768px)")
	const { x, y } = useMemo(() => {
		switch (direction) {
			case "left":
				return { x: -initialX, y: initialY }
			case "right":
				return { x: initialX, y: initialY }
			case "up":
				return { x: initialX, y: -initialY }
			case "down":
				return { x: -initialX, y: initialY }
			default:
				return { x: 0, y: 0 }
		}
	}, [direction, initialX, initialY])

	return (
		<Box
			cursor={"default"}
			_hover={{
				shadow: `${x - 4}px ${y + 5}px ${color}`,
				transitionDuration: "0.2s",
				transitionTimingFunction: "ease-in-out",
			}}
			py={10}
			outlineColor={color}
			rounded={"3xl"}
			minW={"150px"}
			border={"1px"}
			borderColor={color}
			{...props}
			shadow={`${x}px ${y}px ${color}`}
		>
			{children}
		</Box>
	)
}
