import { Box, Button, Input, Flex, Divider, Heading } from "@chakra-ui/react"
import { FormInput } from "../inputs/FormInput"
import { ItemColorSelect } from "../inputs/ItemColorSelect"
import { RenderTag } from "../RenderTag"
import { VscNewFolder } from "react-icons/vsc"
import formatter from "../../utils/formatting/formatting"
import { SearchInput } from "../inputs/SearchInput"
import { useFolder } from "../../hooks/useFolder"
import { FolderListInput } from "../List/FolderListInput"
import { useCallback, useMemo } from "react"

export const NewFolderCard = ({
	name,
	color,
	onChange: handleChange = () => {},
	handleSubmit,
	type = "create",
	parent_folder,
}) => {
	const onChange = useCallback(
		(e) => {
			handleChange(e)
		},
		[handleChange]
	)
	const { folder, newFolder } = useFolder([])
	const handleResult = (items) => {
		items.map((i) => newFolder(i))
	}
	const handleFolderChange = useCallback(
		(item) => {
			if (item.id) {
				onChange({
					target: {
						name: "parent_folder",
						value: item,
					},
				})
			}
		},
		[onChange]
	)
	const nfolder = useMemo(() => {
		let m = []
		if (folder.length > 0) {
			m = folder
		}
		if (parent_folder?.id) {
			m = [...m, parent_folder]
		}
		return m
	}, [folder, parent_folder])
	return (
		<>
			<Box color={"black"}>
				<Flex alignContent={"center"} alignItems={"center"} justifyContent={"space-between"}>
					<FormInput
						HelperText={"what is the folder name?"}
						labelText={"Folder Name"}
						ErrorMessage={"invalid folder name"}
					>
						<Input
							placeholder="Default Folder Name"
							value={name}
							maxLength={15}
							name="name"
							onChange={onChange}
							mt={1}
							justifySelf={"right"}
						/>
					</FormInput>

					<ItemColorSelect
						name={"color"}
						HelperText={"Color Code"}
						labelText={"Folder Color"}
						pl={3}
						defaultValue={color || ""}
						onChange={onChange}
					/>
				</Flex>
				<Divider pt={3} mb={3} />
				<Flex columnGap={3} flexDir="column">
					<Heading pb={1} size={"sm"}>
						Parent Folder
					</Heading>
					<FolderListInput folders={nfolder} onChange={handleFolderChange} selected={parent_folder} />
					<SearchInput type="folders" onResult={handleResult} />
				</Flex>
				<Flex justifyContent={"center"} m={"auto"} pt={2} mb={4}>
					<RenderTag color={color} size="lg">
						{name}
					</RenderTag>
				</Flex>

				<Flex mb={2} justifyContent={"center"}>
					<Button
						shadow={formatter.color.shadows.left}
						onClick={handleSubmit}
						leftIcon={<VscNewFolder />}
						colorScheme={"whatsapp"}
					>
						{type == "update" ? "update folder" : "add new folder"}
					</Button>
				</Flex>
			</Box>
		</>
	)
}
