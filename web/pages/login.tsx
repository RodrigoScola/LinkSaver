import { Text, Button, Heading } from '@chakra-ui/react';
import { useCallback } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useUsers } from '../hooks/useUser';

export default function LOGINPAGE() {
	const user = useUsers();

	const Logout = useCallback(() => {
		sessionStorage.removeItem('user'); // Or localStorage if you're using that
		window.location.reload();
	}, []);

	return (
		<>
			<Heading>
				<Text>Login Page</Text>

				{user.loggedIn ? (
					<Button onClick={Logout}>LogOUt</Button>
				) : (
					<GoogleLogin
						onSuccess={(response) => {
							try {
								user.LogIn(response);

								window.location.href = '/'; // Redirect to home page after login
							} catch (err) {
								console.error(`could not login: ${err}`);
							}
						}}
						onError={() => {
							console.error('Login failed:');
						}}
					/>
				)}
			</Heading>
		</>
	);
}
