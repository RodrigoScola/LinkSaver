import { CategoryProvider } from '../hooks/useCategories';
import { Box, ChakraProvider } from '@chakra-ui/react';
import '@fontsource/poppins';
import '@fontsource/roboto-slab';
import theme from '../theme';
import { store } from '../store/store';
import { Nav } from '../Components/Nav';
import { Provider } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { getData } from '../class/serverBridge';

import dynamic from 'next/dynamic';
import { PostProvider } from '../context/PostContext';
import { PostsProvider } from '../hooks/usePosts';
import { PostCategoryProvider } from '../hooks/usePostCategories';
const Footer = dynamic(() => import('../Components/Footer').then((res) => res.Footer));

function MyApp({ Component, pageProps }) {
	const [currUser, setUser] = useState({ id: null });

	return (
		<ChakraProvider theme={theme}>
			<Provider store={store}>
				<PostsProvider>
					<CategoryProvider>
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
					</CategoryProvider>
				</PostsProvider>
			</Provider>
		</ChakraProvider>
	);
}

export default MyApp;
