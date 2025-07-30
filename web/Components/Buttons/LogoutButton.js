import { Button } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { VscSignOut } from 'react-icons/vsc';
import { useRouter } from 'next/router';

export const LogoutButton = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const handleLogout = async () => {
		//TODO: SIGN OUT

		window.alert('TODO: SIGN OUT');
	};
	return (
		<Button colorScheme={'red'} rightIcon={<VscSignOut />} onClick={handleLogout}>
			Log Out
		</Button>
	);
};
