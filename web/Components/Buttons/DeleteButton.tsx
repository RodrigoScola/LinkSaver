import { Button, Spinner } from '@chakra-ui/react';
import { VscTrash } from 'react-icons/vsc';
import { usePost } from '../../context/PostContext';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../class/serverBridge';
import { useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
export const DeleteButton = ({ ...props }) => {
	const post = usePost();

	const fetchCtx = useQuery({
		queryKey: ['deletePost'],
		queryFn: () => getData.delete(`/posts/${post.post.id}`),
		refetchOnWindowFocus: false,
		initialData: null,
		enabled: false,
	});

	const notifications = useNotifications();

	useEffect(() => {
		console.log(fetchCtx.data);

		if (typeof fetchCtx.data === 'boolean') {
			if (fetchCtx.data) {
				window.location.href = '/';
			} else {
				notifications.add({
					title: 'Error deleting post',
					description: 'There was an error while trying to delete your post.',
					status: 'error',
				});
			}
		}
	}, [fetchCtx.data]);

	const deletePost = async () => {
		await fetchCtx.refetch();

		console.log(fetchCtx.data);

		// window.location.reload();
	};

	return (
		<Button
			{...props}
			colorScheme={'red'}
			variant={'outline'}
			rightIcon={fetchCtx.isLoading ? <></> : <VscTrash />}
			isDisabled={fetchCtx.isLoading}
			onClick={deletePost}>
			{fetchCtx.isLoading ? <Spinner /> : 'Delete'}
		</Button>
	);
};
