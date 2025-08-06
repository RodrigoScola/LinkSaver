import { Tooltip } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { usePost } from '../../context/PostContext';
import { useInteraction } from '../../hooks/useInteraction';
import { color } from '../../utils/formatting/ColorFormat';
import { useUsers } from '../../hooks/useUser';
import { useQuery } from '@tanstack/react-query';
export const LikeButton = ({ isDisabled = true, testing = false, ...props }) => {
	const post = usePost();

	const user = useUsers();

	const interactions = useInteraction();

	const nlike = async () => {
		if (post.post.id == -1) {
			console.error('invalid post id');
			return;
		}

		const hasInteraction = await interactions.GetPostInteractionOfUser(post.post.id, user.user.id);

		if (hasInteraction) {
			await interactions.RemoveLike(hasInteraction.id);

			userPostInteractionFetcher.refetch();
			return;
		}

		await interactions.AddLike(post.post.id, user.user.id);

		userPostInteractionFetcher.refetch();
	};

	const userPostInteractionFetcher = useQuery({
		queryKey: ['userPostInteraction', post.post.id, user.user.id],
		queryFn: () => interactions.GetPostInteractionOfUser(post.post.id, user.user.id),
		refetchOnWindowFocus: false,
		throwOnError: false,
		enabled: !!post.post.id && user.loggedIn,
	});

	if (userPostInteractionFetcher.data) {
		return (
			<Tooltip label={testing && 'you need to be logged in to use me'}>
				<IconButton
					aria-label=''
					isDisabled={user.loggedIn == false && isDisabled}
					onClick={nlike}
					shadow={color.shadows.left}
					backgroundColor={'yellow.200'}
					variant={'outline'}
					icon={
						<CheckIcon
							textShadow={'2px 2px #fff'}
							_hover={{ color: 'yellow.200' }}
							color={'white'}
						/>
					}
					colorScheme={'yellow'}
					{...props}
				/>
			</Tooltip>
		);
	}
	return (
		<>
			<Tooltip
				borderRadius={'xl'}
				label={user.loggedIn == false && 'You need to be logged in to like this post'}>
				<IconButton
					isDisabled={user.loggedIn == false && isDisabled}
					onClick={nlike}
					aria-label=''
					shadow={color.shadows.right}
					variant={'outline'}
					icon={<CheckIcon />}
					colorScheme={'green'}
					{...props}
				/>
			</Tooltip>
		</>
	);
};
