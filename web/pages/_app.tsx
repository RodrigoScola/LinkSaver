import { GoogleOAuthProvider } from '@react-oauth/google';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '../hooks/useUser';

const Footer = dynamic(() => import('../Components/Footer').then((res) => res.Footer));

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	const [currUser, setUser] = useState({ id: null });

	return (
		<GoogleOAuthProvider clientId='608409550207-v26qp9cun3ai6hfi9u63ptg2nd0r3d9b.apps.googleusercontent.com'>
			<QueryClientProvider client={queryClient}>
				<UserProvider>
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
				</UserProvider>
			</QueryClientProvider>
		</GoogleOAuthProvider>
	);
}

export default MyApp;
