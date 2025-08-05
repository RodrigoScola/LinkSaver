import { Box, Button, Center, Input } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { FormInput } from '../Components/inputs/FormInput';
import { BASEURL } from '../utils/formatting/utils';
import { isEmailValid } from '../utils/formatting/EmailFormatting';
import { useNotifications } from '../hooks/useNotifications';
export default function RESETPAGE() {
	const notifications = useNotifications();

	const [email, setEmail] = useState('');
	const [sentEmail, setSentEmail] = useState('');
	const handleEmailSend = async () => {
		if (email == '') {
			notifications.add({
				title: 'your email is empty',
				description: 'we need an email to send the password to',
				status: 'error',
			});
			return null;
		}
		if (!isEmailValid(email)) {
			notifications.add({
				title: 'your email is not valid',
				description: 'we need a valid email to send the code to',
				status: 'error',
			});
			return null;
		}
		if (sentEmail == email) {
			notifications.add({
				title: 'your email was already sent',
				description: 'check your email for more information',
				status: 'info',
			});
			return null;
		}

		alert('TODO: MAKE THIS WORK');

		setSentEmail(email);
		notifications.add({
			title: 'email sent',
			description: `Check your email for more information`,
		});
	};
	return (
		<Box>
			<Center>
				<Box>
					<FormInput HelperText={'What is your email?'} labelText={'Email'}>
						<Input value={email} onChange={(e) => setEmail(e.target.value)} type={'email'} />
					</FormInput>
					<Button onClick={handleEmailSend}>Send email</Button>
				</Box>
			</Center>
		</Box>
	);
}
