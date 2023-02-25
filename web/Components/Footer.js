import { EmailIcon } from "@chakra-ui/icons"
import NextImage from "next/image"
import LogoWhite from "../image/logo_white.png"
import {
	Text,
	Box,
	Grid,
	GridItem,
	Heading,
	ListItem,
	UnorderedList,
	useColorModeValue,
	SimpleGrid,
	useMediaQuery,
	Flex,
} from "@chakra-ui/react"
import NextLink from "next/link"
import { SiGithub, SiLinkedin } from "react-icons/si"
export const Footer = () => {
	const textColor = useColorModeValue("white", "black")
	const [isSmall] = useMediaQuery("(max-width: 768px)")

	return (
		<>
			<Box color={textColor} width={"100%"} mt={20} backgroundColor={"#000000"}>
				<SimpleGrid
					spacingX={"40px"}
					minChildWidth={"20px"}
					spacingY={"40px"}
					justifyContent={"space-around"}
					w={"90%"}
					m={"auto"}
					pt={4}
				>
					<GridItem colSpan={3} w={"300px"}>
						<NextImage alt="logo for link saver" src={LogoWhite} height={125} width={125} />
						<Box pt={3}>
							<Text pb={3} size={"xs"}>
								Developed by -
							</Text>
							<Text size={"xs"}>Rodrigo Scola</Text>
						</Box>
					</GridItem>
					<GridItem colSpan={3}>
						<Heading size={"lg"} fontFamily={"poppins"}>
							Contact Me
						</Heading>
						<UnorderedList display={"flex"} flexDir={"column"} gap={2} pt={4} listStyleType={"none"}>
							<ListItem
								display={"flex"}
								flexDir={"row"}
								gap={3}
								alignItems={"center"}
								as={NextLink}
								href={"https://github.com/RodrigoScola"}
							>
								<SiGithub />
								Github
							</ListItem>
							<ListItem
								display={"flex"}
								flexDir={"row"}
								gap={3}
								alignItems={"center"}
								as={NextLink}
								href={"https://www.linkedin.com/in/rodrigo-scola-2517521b6/"}
							>
								<SiLinkedin />
								Linkedin
							</ListItem>
							<ListItem
								display={"flex"}
								flexDir={"row"}
								gap={3}
								alignItems={"center"}
								as={NextLink}
								href={"https://github.com/RodrigoScola/overflowOrganizer-server"}
							>
								<EmailIcon />
								Email
							</ListItem>
						</UnorderedList>
					</GridItem>
					<GridItem colSpan={3}>
						<Heading size={"lg"} fontFamily={"poppins"}>
							More Information
						</Heading>
						<UnorderedList display={"flex"} flexDir={"column"} listStyleType={"none"}>
							<ListItem as={NextLink} href={"#"}>
								Source Code - Server
							</ListItem>
							<ListItem as={NextLink} href={"https://github.com/RodrigoScola/overflowOrganizer-web"}>
								Source Code - Web
							</ListItem>
							<ListItem as={NextLink} href={"https://github.com/RodrigoScola/overflowOrganizer-server"}>
								My Portfolio
							</ListItem>
						</UnorderedList>
					</GridItem>
				</SimpleGrid>
			</Box>
		</>
	)
}
