import { useEffect } from 'react';
import { BASEURL } from '../utils/formatting/utils';

export default function REGISTERPAGE() {
	useEffect(() => {
		window.location.href = `${BASEURL}/login`;
	}, []);

	return <></>;
}
