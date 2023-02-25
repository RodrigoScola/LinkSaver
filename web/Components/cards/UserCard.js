import dynamic from "next/dynamic"
import { Avatar, Flex, Box, Heading, Button, Input, useMediaQuery } from "@chakra-ui/react"

import { LogoutButton } from "../Buttons/LogoutButton"
import { FormInput } from "../inputs/FormInput"
import formatter from "../../utils/formatting/formatting"
import { useRef } from "react"
const ModalComponent = dynamic(() => import("../ui/modals/ModalComponent").then((m) => m.ModalComponent))
const BoxCard = dynamic(() => import("./BoxCard").then((m) => m.BoxCard))
import { useUsers } from "../../hooks/useUser"

import { VscEdit } from "react-icons/vsc"

export const UserCard = ({ username, postCount, karma }) => {
	const [{ loggedIn }] = useUsers()
	const avatarRef = useRef(null)

	const [isSmall] = useMediaQuery("(max-width: 768px)")

	return (
		<>
			<BoxCard
				minW={"400px"}
				w={!isSmall ? "99%" : "50%"}
				m={"auto"}
				justifyContent={"center"}
				display={"flex"}
				p={5}
				shadow={"2xl"}
				dropShadow={"dark-lg"}
				mb={10}
			>
				<Avatar
					background={"transparent"}
					color={"blackAlpha.700"}
					border={"4px"}
					ref={avatarRef}
					mr={3}
					size={isSmall ? "lg" : "xl"}
					name={username}
				/>

				<Box>
					<Flex flexDir={"row"}>
						<Heading
							size={isSmall ? "md" : "xl"}
							color={"blackAlpha.800"}
							fontWeight={"bold"}
							textShadow={"0px 0px 2px 10em"}
							stroke={"3px"}
						>
							{formatter.str.capitalize(username)}
						</Heading>
						{loggedIn && (
							<ModalComponent
								headerText={"Change Information"}
								footerElement={
									<>
										<ModalComponent
											footerElement={<LogoutButton />}
											headerText={<Heading>Are you sure you want to log out?</Heading>}
											triggerElement={<Button>Log out</Button>}
										>
											Are you sure you want to log out?
										</ModalComponent>
										<Button>Save</Button>
									</>
								}
								triggerElement={
									<Button mx={4} shadow={formatter.color.shadows.right} colorScheme={"blue"}>
										{isSmall ? <VscEdit /> : "Edit Profile"}
									</Button>
								}
							>
								<FormInput labelText={"username"}>
									<Input value={username} onChange={() => {}} />
								</FormInput>
								<FormInput labelText={"password"}>
									<Input onChange={() => {}} type={"password"} value={username} />
								</FormInput>
							</ModalComponent>
						)}
					</Flex>
					<Flex color={"grey"}>
						<Box x={2} y={2} w={"fit-content"} px={4} h={"fit-content"} py={3}>
							<Flex flexDir={"column"} justifyContent={"center"}>
								<Heading size={"sm"} borderBottom={"1px"} borderColor={"pink"} textAlign={"center"}>
									Posts
								</Heading>
								<Heading size={"sm"} textAlign={"center"}>
									{postCount ? postCount : 0}
								</Heading>
							</Flex>
						</Box>
						<Box width="3ox" x={2} y={2} w={"fit-content"} px={4} h={"fit-content"} py={3}>
							<Flex flexDir={"column"} justifyContent={"center"}>
								<Heading size={"sm"} borderBottom={"1px"} borderColor={"pink"} textAlign={"center"}>
									Carma
								</Heading>
								<Heading size={"sm"} textAlign={"center"}>
									{karma}
								</Heading>
							</Flex>
						</Box>
					</Flex>
				</Box>
			</BoxCard>
		</>
	)
}
