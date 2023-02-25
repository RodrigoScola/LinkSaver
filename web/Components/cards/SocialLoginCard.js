import { Button } from "@chakra-ui/react"
import { FaDiscord, FaFacebookF, FaGithub, FaGoogle, FaLinkedin, FaTwitter } from "react-icons/fa"
export const SocialLoginCard = ({ ...props }) => {
	return (
		<>
			<Button {...props} colorScheme={"green"}>
				<FaGoogle />
			</Button>
			<Button {...props} colorScheme={"facebook"}>
				<FaFacebookF />
			</Button>
			<Button {...props} colorScheme={"whatsapp"}>
				<FaGithub />
			</Button>
			<Button {...props} colorScheme={"twitter"}>
				<FaTwitter />
			</Button>
			<Button {...props} colorScheme={"linkedin"}>
				<FaLinkedin />
			</Button>
			<Button {...props} colorScheme={"purple"}>
				<FaDiscord />
			</Button>
		</>
	)
}
