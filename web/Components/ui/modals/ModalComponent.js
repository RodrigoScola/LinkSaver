import {
	Box,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useMediaQuery,
} from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"
import { BoxCard } from "../../cards/BoxCard"
export const ModalComponent = ({
	onClose: closeElement = () => {},
	footerElement,
	headerText,
	triggerElement,
	children,
	...rest
}) => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	const [isSmall] = useMediaQuery("(max-width: 768px)")
	return (
		<Box>
			<Box width={"min-content"} onClick={onOpen}>
				{triggerElement}
			</Box>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent rounded={"3xl"} mx={isSmall ? 10 : null}>
					<BoxCard {...rest}>
						<ModalHeader>
							<Heading size={"3xl"}>{headerText}</Heading>
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>{children}</ModalBody>
						<ModalFooter gap={3}>
							<Button onClick={onClose}>Cancel</Button>

							{footerElement}
						</ModalFooter>
					</BoxCard>
				</ModalContent>
			</Modal>
		</Box>
	)
}
