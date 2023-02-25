import { CategoriesProvider } from "../context/CategoryContext"
import { Box, ChakraProvider } from "@chakra-ui/react"
import "@fontsource/poppins"
import "@fontsource/roboto-slab"
import theme from "../theme"
import { store } from "../store/store"
import { Nav } from "../Components/Nav"
import { Provider } from "react-redux"
import { useCallback, useEffect, useState } from "react"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { getData } from "../class/serverBridge"

import dynamic from "next/dynamic"
const Footer = dynamic(() => import("../Components/Footer").then((res) => res.Footer))

function MyApp({ Component, pageProps }) {
	const [currUser, setUser] = useState({ id: null })
	const [supabaseClient] = useState(() => createBrowserSupabaseClient())
	const [session, setSesssion] = useState(null)
	const go = useCallback(async () => {
		supabaseClient.auth.onAuthStateChange((event, session) => {
			try {
				setSesssion(session)
				if (session.user.id && !currUser.id) {
					setUser(session?.user)
				}
			} catch (err) {
				console.log(err)
			}
		})
	}, [supabaseClient])
	const go2 = useCallback(async () => {
		if (!session || !currUser?.id) return {}
		try {
			const data = await getData.getPost("users", currUser?.id)
			setUser({
				...session.user,
				...data,
			})
		} catch (err) {
			console.log(err)
		}
	}, [session, currUser.id])

	useEffect(() => {
		if (session) {
			go2()
		}
	}, [session, go2])
	useEffect(() => {
		go()
	}, [supabaseClient, go])

	return (
		<SessionContextProvider initialSession={pageProps.initialSession} supabaseClient={supabaseClient}>
			<ChakraProvider theme={theme}>
				<Provider store={store}>
					<CategoriesProvider>
						<Box minH={"75vh"} paddingRight={10} paddingLeft={10} maxW={"1400px"} margin={"auto"} pt={"5"}>
							<Nav user={currUser} />
							<Component {...pageProps} />
						</Box>
						<Footer />
					</CategoriesProvider>
				</Provider>
			</ChakraProvider>
		</SessionContextProvider>
	)
}

export default MyApp
