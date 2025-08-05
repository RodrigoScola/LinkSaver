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
} from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { BoxCard } from '../../cards/BoxCard';
import { MouseEvent, ReactNode } from 'react';

//TODO: Figure out where the color would be

export type ModalComponentProps = {
	onClose?: (e?: MouseEvent) => void;
	footerElement?: ReactNode;
	headerText?: string | ReactNode;
	triggerElement?: ReactNode;
	children?: ReactNode;
};

export const ModalComponent = ({
	onClose: closeElement = () => {},
	footerElement,
	headerText,
	triggerElement,
	children,

	...rest
}: ModalComponentProps) => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const [isSmall] = useMediaQuery('(max-width: 768px)');
	return (
		<Box>
			<Box width={'min-content'} onClick={onOpen}>
				{triggerElement}
			</Box>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent rounded={'3xl'} mx={isSmall ? `10px` : `0`}>
					<BoxCard {...rest}>
						{headerText && (
							<ModalHeader>
								<Heading size={'3xl'}>{headerText}</Heading>
							</ModalHeader>
						)}
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
	);
};
