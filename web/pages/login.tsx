import { useRouter } from 'next/router';
import { Text, Box, Input, Button, Center, Link, Heading, Flex } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { FormInput } from '../Components/inputs/FormInput';
import { RenderHead } from '../Components/RenderHead';
import { BASEURL } from '../utils/formatting/utils';
import { BoxCard } from '../Components/cards/BoxCard';
import formatter from '../utils/formatting/formatting';
import { createNotification } from '../store/notifications/NotificationSlice';

export default function LOGINPAGE() {
	//TODO: add a login page
	//TODO: Need to login with google

	return <></>;
}
