import { CategoryProvider } from '../hooks/useCategories';
import { Box, ChakraProvider } from '@chakra-ui/react';
import '@fontsource/poppins';
import '@fontsource/roboto-slab';
import theme from '../theme';
import { Nav } from '../Components/Nav';
import { useState } from 'react';

import dynamic from 'next/dynamic';
import { PostsProvider } from '../hooks/usePosts';
import { PostCategoryProvider } from '../hooks/usePostCategories';
import { FolderProvider } from '../hooks/useFolder';
import { NotificationProvider } from '../hooks/useNotifications';
import { InteractionsProvider } from '../hooks/useInteraction';
import { AppProps } from 'next/app';
const Footer = dynamic(() => import('../Components/Footer').then((res) => res.Footer));

function MyApp({ Component, pageProps }: AppProps) {
	const [currUser, setUser] = useState({ id: null });

	return (
		<ChakraProvider theme={theme}>
			<NotificationProvider>
				<FolderProvider>
					<PostsProvider>
						<CategoryProvider>
							<InteractionsProvider>
								<PostCategoryProvider>
									<Box
										minH={'75vh'}
										paddingRight={10}
										paddingLeft={10}
										maxW={'1400px'}
										margin={'auto'}
										pt={'5'}>
										<Nav user={currUser} />
										<Component {...pageProps} />
									</Box>
								</PostCategoryProvider>
								<Footer />
							</InteractionsProvider>
						</CategoryProvider>
					</PostsProvider>
				</FolderProvider>
			</NotificationProvider>
		</ChakraProvider>
	);
}

export default MyApp;
