import { MdOutlineNewLabel } from "react-icons/md"
import { Flex, Button, Box, Heading } from "@chakra-ui/react"
import { NewCategory } from "../forms/NewCategory"
import { SearchInput } from "../inputs/SearchInput"
import { AddIcon } from "@chakra-ui/icons"
import { TagInput } from "../inputs/TagInput/TagInput"
import { useCallback, useState } from "react"
import { useCategories } from "../../hooks/useCategories"
import { PopoverElement } from "../ui/popover/PopoverElement"
import formatter from "../../utils/formatting/formatting"
import { getData } from "../../class/serverBridge"
import { RenderTag } from "../RenderTag"
import { obj } from "../../utils/formatting/ObjectFormat"
import { useDispatch } from "react-redux"
import { TagInputProvider } from "../../context/TagInputContext"
import { addItem, newTagInputItem, selectTagByName } from "../inputs/TagInput/TagInputSlice"
import { useSelect } from "../../hooks/useSelect"

export const SelectCategory = ({
	baseCategories,
	onChange = () => {},
	name = "newPostForm",
	defaultSelected = false,
	...props
}) => {
	const [results, setResults] = useState([])
	const { categories: popularCategories, setNewIds: setPopularCategoriesIds, setCategories } = useCategories()
	const { categories: stackCats, setCategories: setStackCats } = useCategories(obj.getUniques(baseCategories, "id"))

	const dispatch = useDispatch()
	const items = useSelect(selectTagByName, name)

	const newItem = useCallback(
		(category) => {
			const ids = obj.getUniques(items, "id")
			setStackCats([category])
			if (!ids.includes(category.id)) {
				dispatch(
					addItem(
						newTagInputItem({
							...category,
							isSelected: true,
							name: name,
							text: category.cat_name,
						})
					)
				)
			}
		},
		[items, dispatch, name, setStackCats]
	)
	return (
		<Flex alignItems={"center"} wrap={"wrap"} {...props}>
			<TagInputProvider name={name} defaultSelected={defaultSelected}>
				<PopoverElement
					onOpen={async () => {
						if (popularCategories.length == 0) {
							const data = await getData.getPosts("categories", { params: { count: 5 } })
							setCategories(data)
						}
					}}
					triggerElement={
						<Button borderRadius={"50%"} position={"relative"} height={"40px"} width={"25px"} variant={"outline"}>
							<AddIcon boxSize={3} />
						</Button>
					}
					headerElement={<Heading size={"md"}>Categories</Heading>}
				>
					<Box>
						{popularCategories?.map((category, ind) => {
							return (
								<RenderTag
									m={1}
									key={"stack cat" + category.id}
									onClick={() => {
										setStackCats([{ ...category, isSelected: true }])
									}}
									text={formatter.initials(category.cat_name, 4)}
									color={category.cat_color}
								/>
							)
						})}
					</Box>
					<Box>
						<SearchInput type={"categories"} name={"categorySearch"} onResult={(res) => setResults(res)} />
						{results?.map((category, ind) => {
							return (
								<RenderTag
									m={1}
									key={"stack cat" + category.id}
									onClick={() => {
										setStackCats([category])
										dispatch(
											addItem(
												newTagInputItem({
													...category,
													isSelected: true,
													name: name,
													text: category.cat_name,
												})
											)
										)
									}}
									text={formatter.initials(category.cat_name, 4)}
									color={category.cat_color}
								/>
							)
						})}
					</Box>
					<PopoverElement
						style={{
							padding: "1em",
							marginRight: "1em",
						}}
						headerElement={<Heading size={"md"}>New Category</Heading>}
						triggerStyle={{
							display: "flex",
							justifyContent: "center",
							width: "full",
						}}
						triggerElement={
							<Button leftIcon={<MdOutlineNewLabel />} size={"sm"} colorScheme={"yellow"} mt={4}>
								Add New
							</Button>
						}
					>
						<NewCategory onSubmit={(item) => newItem(item)} />
					</PopoverElement>
				</PopoverElement>
				<TagInput
					display={"flex"}
					maxW={"fit-content"}
					wrap={"wrap"}
					gap={2}
					onSelectChange={onChange}
					name={name}
					totalTags={stackCats}
				/>
			</TagInputProvider>
		</Flex>
	)
}
