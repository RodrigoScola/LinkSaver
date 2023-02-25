import { Center, Heading, Box, Flex } from "@chakra-ui/react"
import Link from "next/link"

export default function FOROUFOUR() {
	return (
		<Flex h={"70vh"} justifyContent={"center"}>
			<Center alignItems={"center"} alignSelf={"center"} flexDir={"column"}>
				<Heading>404 - Page Not Found</Heading>
				<Heading>
					<Link href={"/"}>Click Here to go to the Home Page</Link>
				</Heading>
			</Center>
		</Flex>
	)
}
