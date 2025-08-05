import { BoxCard } from '../Components/cards/BoxCard';
import { Heading } from '@chakra-ui/react';
import { Text, Box, Button, Center, Flex, Input, Link } from '@chakra-ui/react';
import { BASEURL } from '../utils/formatting/utils';
import { FormInput } from '../Components/inputs/FormInput';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { RenderHead } from '../Components/RenderHead';
import formatter from '../utils/formatting/formatting';

export default function REGISTERPAGE() {
	//TODO: add a register page
	//TODO: Need to login with google

	return <></>;
}
