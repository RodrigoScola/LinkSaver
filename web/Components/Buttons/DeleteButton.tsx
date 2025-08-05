import { Button, Spinner } from '@chakra-ui/react';
import { VscTrash } from 'react-icons/vsc';
import { usePost } from '../../context/PostContext';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../class/serverBridge';
export const DeleteButton = ({ ...props }) => {
	const post = usePost();

	const fetchCtx = useQuery({
		queryKey: ['deletePost'],
		queryFn: () => getData.delete(`/posts/${post.post.id}`),
		refetchOnWindowFocus: false,
		initialData: null,
		enabled: false,
	});

	const deletePost = () => {
		fetchCtx.refetch();
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
