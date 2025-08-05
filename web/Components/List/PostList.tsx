import { Img, Link, Flex } from '@chakra-ui/react';
import { usePost } from '../../context/PostContext';

export const PostList = () => {
	const post = usePost();
	//TODO: ADD POST PREVIEWS

	return (
		<Flex flexDir={'row'} gap={3}>
			{post?.preview?.images[0] && <Img src={post.preview.images[0].url} />}
			<Link href={post.post.post_url !== '' ? post.post.post_url : '#'}>{post.post.title}</Link>
		</Flex>
	);
};
