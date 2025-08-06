import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { Text, Box, Input, Button, Center, Link, Heading, Flex } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useCallback, useState } from 'react';
import { FormInput } from '../Components/inputs/FormInput';
import { RenderHead } from '../Components/RenderHead';
import { BASEURL } from '../utils/formatting/utils';
import { BoxCard } from '../Components/cards/BoxCard';
import formatter from '../utils/formatting/formatting';
import { GoogleLogin } from '@react-oauth/google';
import { decode } from 'punycode';
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
							if (!response.credential) return;

							const decoded = jwtDecode(response.credential);

							window.sessionStorage.setItem('user', JSON.stringify(decoded));

							window.location.reload();
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
