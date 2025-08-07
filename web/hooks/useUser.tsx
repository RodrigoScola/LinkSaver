import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useObject } from './useObject';
import { OmitBy, User } from 'shared';
import { getData } from '../class/serverBridge';
import { CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

type Client = {
	iss: string;
	azp: string;
	aud: string;
	sub: string;
	email: string;
	email_verified: boolean;
	nbf: number;
	name: string;
	picture: string;
	given_name: string;
	iat: number;
	exp: number;
	jti: string;
};

type UserContextType = {
	loggedIn: boolean;
	LogIn: (response: CredentialResponse) => void;

	user: User;

	LogOut: () => void;

	update: (u: Partial<User>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const userObj = useObject<User>({
		google_id: '',
		id: -1,
		isLive: false,

		status: 'public',
		image_url: '',
	});

	const clientObj = useObject<Client | null>(null);

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		(async () => {
			const user = window.localStorage.getItem('user');

			if (!user) {
				setIsLoggedIn(false);

				return;
			}

			let parsedUser: Client | undefined;

			try {
				parsedUser = JSON.parse(user);

				clientObj.update(JSON.parse(user));
			} catch (e) {
				console.error(`could not parse google client`);

				window.localStorage.removeItem('user');
			}

			if (!parsedUser) {
				return;
			}

			clientObj.set(parsedUser);

			const fetchedUser = await getData.get(`/users/?google_id=${parsedUser.email}`);

			if (fetchedUser.length === 0) {
				let newUser = await getData.post('/users/', {
					google_id: parsedUser.email,
					image_url: parsedUser.picture,
					isLive: true,
					status: 'public',
				} as OmitBy<User, 'id'>);

				if (newUser) {
					userObj.set(newUser);
				}
			} else {
				userObj.set(fetchedUser[0]);
			}

			setIsLoggedIn(true);
		})();
	}, []);

	function LogOut() {
		sessionStorage.removeItem('user'); // Or localStorage if you're using that
	}

	const LogIn = useCallback((response: CredentialResponse) => {
		if (!response.credential) throw new Error('No credential in response');

		const decoded = jwtDecode(response.credential);

		window.localStorage.setItem('user', JSON.stringify(decoded));
	}, []);

	const setCurrUser = useCallback((info: Partial<User>) => {
		userObj.update(info);
	}, []);
	return (
		<UserContext.Provider
			value={{
				loggedIn: isLoggedIn ?? false,
				LogIn,
				user: userObj.value,
				LogOut,

				update: setCurrUser,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export const useUsers = () => {
	const ctx = useContext(UserContext);

	if (!ctx) {
		throw new Error(`useUser must be used within a UserProvider`);
	}
	return ctx;
};
