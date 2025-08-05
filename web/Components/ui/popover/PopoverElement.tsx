import {
	Box,
	BoxProps,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverContentProps,
	PopoverFooter,
	PopoverHeader,
	PopoverProps,
	PopoverTrigger,
	useDisclosure,
	useMediaQuery,
} from '@chakra-ui/react';
import { MouseEventHandler, useEffect } from 'react';
import { BoxCard } from '../../cards/BoxCard';

type PopoverElementProps = {
	onOpen?: (e?: MouseEventHandler<HTMLDivElement>) => void;
	onClose?: () => void;
	footerElement?: React.ReactNode;
	triggerElement?: React.ReactNode;
	triggerStyle?: BoxProps;
	headerElement?: React.ReactNode;
	style?: PopoverContentProps;
	defaultOpen?: boolean;
	children?: React.ReactNode;
} & PopoverProps;

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
}: PopoverElementProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isSmall] = useMediaQuery('(max-width:768px)');
	useEffect(() => {
		if (isOpen == true) {
			openChange();
		} else {
			closeChange();
		}
	}, [isOpen, openChange, closeChange]);
	useEffect(() => {
		if (defaultOpen == true) {
			onOpen();
		}
	}, [defaultOpen, onOpen]);
	return (
		<Popover {...rest} isOpen={isOpen} onClose={onClose}>
			<PopoverTrigger>
				<Box width={'fit-content'} onClick={onOpen} {...triggerStyle}>
					{triggerElement}
				</Box>
			</PopoverTrigger>
			{isOpen ? (
				<PopoverContent
					borderRadius={'3xl'}
					{...style}
					mx={isSmall ? 10 : 0}
					width={'fit-content'}
					maxW={'90%'}>
					<BoxCard>
						<PopoverArrow />
						<PopoverCloseButton color={'white'} />
						{headerElement ? <PopoverHeader>{headerElement}</PopoverHeader> : null}
						<PopoverBody>{children}</PopoverBody>
						{footerElement ? <PopoverFooter>{footerElement}</PopoverFooter> : null}
					</BoxCard>
				</PopoverContent>
			) : null}
		</Popover>
	);
};
