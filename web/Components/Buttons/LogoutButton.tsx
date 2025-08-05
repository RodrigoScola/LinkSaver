import { Button } from '@chakra-ui/react';
import { VscSignOut } from 'react-icons/vsc';

export const LogoutButton = () => {
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
