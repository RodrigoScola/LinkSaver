import { SimpleGrid } from '@chakra-ui/react';

export const RenderPosts = ({ children }: { children: React.ReactNode }) => {
	return (
		<SimpleGrid pt={10} spacingY={'20px'} spacingX={'15px'} minChildWidth={'200px'}>
			{children}
		</SimpleGrid>
	);
};
