import { color, extendTheme } from "@chakra-ui/react"
import formatter from "./utils/formatting/formatting"
import { mode } from "@chakra-ui/theme-tools"
const colors = {
	yellow: {
		200: "#A8C712",
		500: "#A8C732",
	},
	red: {
		200: "#EC3D3D",
		400: "F53A3A",
	},
}
const fonts = {
	heading: `'Roboto Slab', sans-serif`,
	body: `'Fira Sans', sans-serif`,
}
const theme = extendTheme({
	colors,
	config: {
		initialColorMode: "light",
		useSystemColorMode: false,
	},
	styles: {
		global: {
			body: {
				bg: mode("#f2f2f2", "#00ff00"),
			},
		},
	},

	components: {
		Heading: {
			sizes: {
				xl: {
					fontWeight: "400",
				},
			},
		},
		Tag: {
			baseStyle: {},
		},
		Input: {
			baseStyle: {
				field: {
					borderRadius: "4px",
					shadowColor: "#272b27",
					borderColor: "#272b27",
					boxShadow: formatter.color.shadows.right,
				},
			},
		},

		Button: {
			baseStyle: {
				border: "2px",
				fontWeight: "200",
			},
			variants: {
				outline: {
					shadow: formatter.color.shadows.right,
					my: 1,
					borderColor: "black",
					rounded: "lg",
				},
			},
			sizes: {
				md: {
					fontSize: "14px",
				},
			},
			defaultProps: {
				variant: "outline",
			},
		},
		Card: {
			defaultProps: {
				FontFace: "Roboto Slab",
			},
		},
	},
	fonts,
})
export default theme
