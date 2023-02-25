import { useRouter } from "next/router"
import { Text, Box, Input, Button, Center, Link, Heading, Flex } from "@chakra-ui/react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"
import { FormInput } from "../Components/inputs/FormInput"
import { RenderHead } from "../Components/RenderHead"
import { BASEURL } from "../utils/formatting/utils"
import { BoxCard } from "../Components/cards/BoxCard"
import formatter from "../utils/formatting/formatting"
import { createNotification } from "../store/notifications/NotificationSlice"

export default function LOGINPAGE() {
	const [{ email, password }, setEmailPassword] = useState({ email: "", password: "" })
	const supabase = useSupabaseClient()
	const handleChange = (e) => {
		setEmailPassword((curr) => ({ ...curr, [e.target.name]: e.target.value }))
	}
	const router = useRouter()
	const handleSubmit = async (e) => {
		e.preventDefault()
		const { error, data } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		if (error) {
			createNotification({ title: error.message, status: "error" })
		}
		if (data?.user?.id) {
			router.push("/")
		}
	}

	return (
		<Box>
			<RenderHead title={"Login Page"} />
			<form onSubmit={handleSubmit}>
				<Box as={Center} flexDir={"column"} w={"full"} h={"50vh"}>
					<Center>
						<BoxCard gap={4} px={10}>
							<Heading textAlign={"center"}>Login</Heading>
							<FormInput w={"full"} py={4} labelText={"Email"}>
								<Input name="email" onChange={handleChange} value={email} type={"email"} />
							</FormInput>
							<FormInput w={"full"} labelText={"Password"}>
								<Input name={"password"} onChange={handleChange} value={password} type={"password"} />
							</FormInput>
							<Flex pt={4}>
								<Button
									w={"full"}
									shadow={formatter.color.shadows.left}
									colorScheme={"yellow"}
									onClick={handleSubmit}
									type="submit"
								>
									Login
								</Button>
							</Flex>
							<Text>
								Dont have an account?
								<Link px={1} href={`${BASEURL}/register`}>
									Click Here
								</Link>
							</Text>
						</BoxCard>
					</Center>
				</Box>
			</form>
		</Box>
	)
}
