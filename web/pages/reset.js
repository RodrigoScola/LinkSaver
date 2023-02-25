import { Box, Button, Center, Input } from "@chakra-ui/react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"
import { FormInput } from "../Components/inputs/FormInput"
import { BASEURL } from "../utils/formatting/utils"
import { createNotification } from "../store/notifications/NotificationSlice"
import { isEmailValid } from "../utils/formatting/EmailFormatting"
export default function RESETPAGE() {
	const supabase = useSupabaseClient()
	const [email, setEmail] = useState("")
	const [sentEmail, setSentEmail] = useState("")
	const handleEmailSend = async () => {
		if (email == "") {
			createNotification({
				title: "your email is empty",
				description: "we need an email to send the password to",
				status: "error",
			})
			return null
		}
		if (!isEmailValid(email)) {
			createNotification({
				title: "your email is not valid",
				description: "we need a valid email to send the code to",
				status: "error",
			})
			return null
		}
		if (sentEmail == email) {
			createNotification({
				title: "your email was already sent",
				description: "check your email for more information",
				status: "info",
			})
			return null
		}
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${BASEURL}/update-password`,
		})

		setSentEmail(email)
		createNotification({
			title: "email sent",
			description: `Check your email for more information`,
		})
	}
	return (
		<Box>
			<Center>
				<Box>
					<FormInput HelperText={"What is your email?"} labelText={"Email"}>
						<Input value={email} onChange={(e) => setEmail(e.target.value)} type={"email"} />
					</FormInput>
					<Button onClick={handleEmailSend}>Send email</Button>
				</Box>
			</Center>
		</Box>
	)
}
