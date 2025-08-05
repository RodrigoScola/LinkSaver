import { useCallback, useMemo } from 'react';
import { useObject } from './useObject';
import { User } from 'shared';
import { update } from 'lodash';

export const useUsers = () => {
	const userObj = useObject<User>({
		google_id: '',
		id: -1,
		isLive: false,

		status: 'public',
		image_url: '',
	});

	const setCurrUser = useCallback((info: Partial<User>) => {
		userObj.update(info);
	}, []);
	return {
		get loggedIn() {
			return userObj.value.id !== null;
		},
		user: userObj.value,

		update: setCurrUser,
	};
};
