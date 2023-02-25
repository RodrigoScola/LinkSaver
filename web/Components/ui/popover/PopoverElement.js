import {
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverFooter,
	PopoverHeader,
	PopoverTrigger,
	Popover,
	useDisclosure,
	Box,
	useMediaQuery,
} from "@chakra-ui/react"
import { useEffect } from "react"
import { BoxCard } from "../../cards/BoxCard"

export const PopoverElement = ({
	onOpen: openChange = () => {},
	onClose: closeChange = () => {},
	footerElement,
	triggerElement,
	triggerStyle,
	headerElement,
	style,
	defaultOpen = false,
	children,
	...rest
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [isSmall] = useMediaQuery("(max-width:768px)")
	useEffect(() => {
		if (isOpen == true) {
			openChange()
		} else {
			closeChange()
		}
	}, [isOpen, openChange, closeChange])
	useEffect(() => {
		if (defaultOpen == true) {
			onOpen()
		}
	}, [defaultOpen, onOpen])
	return (
		<Popover {...rest} isOpen={isOpen} onClose={onClose}>
			<PopoverTrigger>
				<Box width={"fit-content"} onClick={onOpen} {...triggerStyle}>
					{triggerElement}
				</Box>
			</PopoverTrigger>
			{isOpen ? (
				<PopoverContent borderRadius={"3xl"} {...style} mx={isSmall ? 10 : null} width={"fit-content"} maxW={"90%"}>
					<BoxCard>
						<PopoverArrow />
						<PopoverCloseButton color={"white"} />
						{headerElement ? <PopoverHeader>{headerElement}</PopoverHeader> : null}
						<PopoverBody>{children}</PopoverBody>
						{footerElement ? <PopoverFooter>{footerElement}</PopoverFooter> : null}
					</BoxCard>
				</PopoverContent>
			) : null}
		</Popover>
	)
}
