import { SimpleGrid, useMediaQuery } from "@chakra-ui/react"
import { PopoverElement } from "../ui/popover/PopoverElement"
import { Box, Input, Button, Flex, Text, InputGroup, GridItem, Grid } from "@chakra-ui/react"
import { FormInput } from "../inputs/FormInput"
import { useDispatch } from "react-redux"
import { useFetch } from "../../hooks/useFetch"
import { submitPost } from "../../store/newPost/newPostSlice"
import formatter from "../../utils/formatting/formatting"
import { useCallback, useContext, useEffect } from "react"
import { useCategories } from "../../hooks/useCategories"
import { SelectFolder } from "../cards/SelectFolder"
import { NewPostContext } from "../../context/newPostContext"
import { SelectCategory } from "../cards/SelectCategory"
import { useFolder } from "../../hooks/useFolder"
import { obj } from "../../utils/formatting/ObjectFormat"
import { VscFolder, VscFolderActive, VscSave } from "react-icons/vsc"
import { RenderTag } from "../RenderTag"

export const NewPostForm = ({ ...rest }) => {
	const stackPost = useFetch("")
	const { folder: allFolders } = useFolder()
	const dispatch = useDispatch()
	const { categories: stackCats, setNewIds, setCategories: setStackCats } = useCategories([])
	const {
		canSubmit,
		errors,
		setCategories,
		changeTitle,
		changeUrl,
		post_url: postUrl,
		setFolder,
		...post
	} = useContext(NewPostContext)

	const [isSmall] = useMediaQuery("(max-width:768px)")

	const d = useCallback(
		(data) => {
			if (post.title == "") {
				changeTitle(data.title)
			}
		},
		[changeTitle, post.title]
	)

	useEffect(() => {
		if (stackPost.data) {
			d(stackPost.data)
		}
	}, [stackPost.data, d])
	const handleChange = useCallback(
		async (new_url) => {
			if (new_url && formatter.url.isValid(new_url)) {
				stackPost.setUrl(`_/getPreview/?url=${new_url}`)
			}
		},
		[stackPost]
	)
	const changeCats = useCallback(
		(items) => {
			setCategories(obj.getUniques(items, "id"))
		},
		[setCategories]
	)
	useEffect(() => {
		if (postUrl) {
			handleChange(postUrl)
		}
	}, [postUrl, handleChange])

	const handleSubmit = (e) => {
		e.preventDefault()

		dispatch(submitPost())
	}
	return (
		<Box w={"fit-content"} maxW={"600px"} margin={"auto"} {...rest}>
			<form onSubmit={handleSubmit}>
				<Grid gap={5} gridTemplateColumns={"repeat(2, 1fr)"}>
					<GridItem>
						<FormInput
							width={"full"}
							isError={Object.keys(errors).includes("title")}
							HelperText={"what is the title of the post?"}
							labelText={"Post Title"}
							ErrorMessage={errors.title?.message}
						>
							<Input value={post?.title} onChange={(e) => changeTitle(e.target.value)} />
						</FormInput>
					</GridItem>
					<GridItem>
						<FormInput
							HelperText={"what is the url of the post?"}
							labelText={"Post url"}
							ErrorMessage={"invalid post url"}
							w={"100%"}
						>
							<InputGroup>
								<Input
									type={"url"}
									name="stack_post_url"
									onChange={(e) => {
										changeUrl(e.target.value)
									}}
								/>
							</InputGroup>
						</FormInput>
					</GridItem>
				</Grid>

				<SimpleGrid gap={5} minChildWidth={"150px"}>
					<GridItem>
						<SelectCategory name="NewPostForm" onChange={changeCats} baseCategories={stackCats} />

						{errors.categories ? <Text color="red">{errors.categories.message}</Text> : null}
					</GridItem>
					<GridItem>
						{post?.folder && <RenderTag variant="outline" color={post?.folder?.color} text={post?.folder?.name} />}
						<PopoverElement
							triggerElement={
								<Button w={isSmall ? "300px" : ""} leftIcon={post.folder ? <VscFolderActive /> : <VscFolder />}>
									Select Folder
								</Button>
							}
						>
							<SelectFolder onChange={(folder) => setFolder(folder.id)} baseFolders={allFolders} />
						</PopoverElement>
					</GridItem>
				</SimpleGrid>

				<Flex width={"full"} justifyContent={"center"} pt={4}>
					<Button
						w={"50%"}
						colorScheme={"yellow"}
						shadow={formatter.color.shadows.left}
						isDisabled={canSubmit}
						leftIcon={<VscSave />}
						disabled={canSubmit == false}
						type="submit"
					>
						Create
					</Button>
				</Flex>
			</form>
		</Box>
	)
}
