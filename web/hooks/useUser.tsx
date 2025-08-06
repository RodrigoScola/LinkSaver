import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useObject } from './useObject';
import { OmitBy, User } from 'shared';
import { getData } from '../class/serverBridge';

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

	user: User;

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
			const user = window.sessionStorage.getItem('user');

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

	const setCurrUser = useCallback((info: Partial<User>) => {
		userObj.update(info);
	}, []);
	return (
		<UserContext.Provider
			value={{
				loggedIn: isLoggedIn ?? false,
				user: userObj.value,

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
