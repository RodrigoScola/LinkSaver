import { BoxCard } from "../Components/cards/BoxCard"
import { Heading } from "@chakra-ui/react"
import { Text, Box, Button, Center, Flex, Input, Link } from "@chakra-ui/react"
import { BASEURL } from "../utils/formatting/utils"
import { FormInput } from "../Components/inputs/FormInput"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"
import { createNotification } from "../store/notifications/NotificationSlice"
import { useRouter } from "next/router"
import { RenderHead } from "../Components/RenderHead"
import formatter from "../utils/formatting/formatting"

export default function REGISTERPAGE() {
	const supabaseClient = useSupabaseClient()
	const [{ email, password, username }, setInfo] = useState({ email: "", password: "", username: "" })
	const router = useRouter()

	const handleChange = (e) => {
		setInfo((curr) => ({
			...curr,
			[e.target.name]: e.target.value,
		}))
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		const { data: user } = await supabaseClient.from("profiles").select("username").eq("username", username).single()
		if (user?.username) {
			createNotification({ title: "Username already Exists", status: "error" })
			return null
		} else {
			const { data, error } = await supabaseClient.auth.signUp({ email, password })
			if (error) {
				if (error.message.includes('duplicate key value violates unique constraint "profiles_username_key"'))
					createNotification({ title: "Email already in use", status: "error" })
				else {
					createNotification({ title: error.message, status: "error" })
				}
			}

			if (data?.user?.role == "authenticated") {
				await supabaseClient.from("profiles").update({ username }).eq("id", data.user.id)
				router.push("/")
			}
		}
	}
	return (
		<Center>
			<RenderHead title={"Register Page"} />
			<Box>
				<Center>
					<RenderHead title={"Register Page"} />
					<form onSubmit={handleSubmit}>
						<Box as={Center} flexDir={"column"} w={"full"} h={"50vh"}>
							<Center>
								<BoxCard gap={4} px={10}>
									<Heading textAlign={"center"}>Create an Account</Heading>
									<FormInput w={"full"} py={4} labelText={"Username"}>
										<Input name="username" onChange={handleChange} value={username} />
									</FormInput>
									<FormInput w={"full"} labelText={"Email"}>
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
											Register
										</Button>
									</Flex>
									<Text>
										Already Have an Account?
										<Link px={1} href={`${BASEURL}/login`}>
											Click Here
										</Link>
									</Text>
								</BoxCard>
							</Center>
						</Box>
					</form>
				</Center>
			</Box>
		</Center>
	)
}
