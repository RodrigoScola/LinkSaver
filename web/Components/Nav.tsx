import { Box, Button, Flex, Heading, Link, SimpleGrid, useMediaQuery } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useUsers } from '../hooks/useUser';
import { BASEURL } from '../utils/formatting/utils';
import { PopoverElement } from './ui/popover/PopoverElement';
import { useNotifications } from '../hooks/useNotifications';
import NextImage from 'next/image';
import { VscNewFile } from 'react-icons/vsc';
import formatter from '../utils/formatting/formatting';
import LogoBlack from '../image/logo.png';

import dynamic from 'next/dynamic';

import { NavSearch } from './NavSearch';
// const NavSearch = dynamic(() => import('./NavSearch').then(r => r.NavSearch))
const NewPostProvider = dynamic(() => import('../context/newPostContext').then((r) => r.NewPostProvider));
const NewPostForm = dynamic(() => import('./forms/newPostForm').then((r) => r.NewPostForm));

export const Nav = ({ user, ...rest }: { user: any }) => {
	const currentUser = useUsers();

	useEffect(() => {
		if (user) {
			currentUser.update(user);
		}
	}, [user]);

	useNotifications();

	const [isSmall] = useMediaQuery('(max-width:768px)');

	return (
		<Box {...rest} pb={3} w={'full'}>
			<SimpleGrid minChildWidth={'100px'} alignItems={'start'} gap={5}>
				<Link w={'20%'} minW={'100px'} href={`${BASEURL}/`}>
					<NextImage src={LogoBlack} alt={'logo for link saver'} height={100} width={100} />
				</Link>
				{!isSmall && (
					<Box width={'full'} background={''}>
						<NavSearch />
					</Box>
				)}
				{/* <Flex alignItems={"start"} gap={3} w={"55%"} justifyContent={"right"}> */}
				<Flex alignItems={'center'} gap={3}>
					{currentUser.loggedIn ? (
						<>
							<PopoverElement
								style={{
									maxWidth: '500px',
									minW: '300px',
								}}
								triggerElement={
									<Button
										shadow={'-2px 2px'}
										rounded={'lg'}
										colorScheme={'yellow'}
										rightIcon={<VscNewFile />}
										variant={'outline'}>
										{isSmall ? '' : 'New Post'}
									</Button>
								}
								headerElement={<Heading size={'xl'}>New Post</Heading>}>
								<NewPostProvider>
									<NewPostForm maxW={'300px'} />
								</NewPostProvider>
							</PopoverElement>
							<Box>
								<Heading size={'sm'}>
									<Link href={`${BASEURL}/users/${user?.username}`}>
										{formatter.str.capitalize(user?.username)}
									</Link>
								</Heading>
							</Box>
						</>
					) : (
						<Button shadow={formatter.color.shadows.left}>
							<Link href={`${BASEURL}/login`}>Log In</Link>
						</Button>
					)}
				</Flex>
				{/* {isSmall && (
					<Box width={"80vw"} background={""}>
						<NavSearch />
					</Box>
				)} */}
			</SimpleGrid>
			{/* </Flex> */}
		</Box>
	);
};
