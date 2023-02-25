import { BiCategoryAlt } from "react-icons/bi"
import { useEffect } from "react"
import { useDelay } from "../../hooks/useDelay"
import { Box, Flex, Divider, Button } from "@chakra-ui/react"
import { FormInput } from "../inputs/FormInput"
import { Input } from "@chakra-ui/react"
import { ItemColorSelect } from "../inputs/ItemColorSelect"
import { RenderTag } from "../RenderTag"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { selectNewCategory, updateData, submitCategory } from "../../store/newPost/newPostSlice"
import { add_category } from "../../store/category/CategorySlice"
import { newCategory } from "../../utils/formatting/utils"
export const NewCategory = ({ onSubmit = () => {} }) => {
	const { fn: setNewFolderColor } = useDelay(
		(e) => dispatch(updateData({ type: "category", [e.target.name]: e.target.value })),
		15
	)

	const catInfo = useSelector(selectNewCategory)
	const dispatch = useDispatch()
	const updateinfo = (e) => {
		dispatch(
			updateData({
				type: "category",
				[e.target.name]: e.target.value,
			})
		)
	}
	const handleSubmit = (e) => {
		dispatch(submitCategory())
	}
	useEffect(() => {
		if (catInfo.data) {
			dispatch(add_category({ category: newCategory(catInfo.created) }))

			onSubmit(catInfo.data)
		}
	}, [catInfo, dispatch, onSubmit])

	return (
		<>
			<Box>
				<Flex alignContent={"center"} alignItems={"center"} justifyContent={"space-between"}>
					<FormInput
						HelperText={"what is the category name?"}
						labelText={"Category Name"}
						ErrorMessage={"invalid category name"}
					>
						<Input
							placeholder="Default Category Name"
							value={catInfo?.cat_name}
							name="cat_name"
							maxLength={15}
							onChange={(e) => updateinfo(e)}
							mt={1}
							justifySelf={"right"}
						/>
					</FormInput>
					<ItemColorSelect
						HelperText={"Color Code"}
						name="cat_color"
						labelText={"Category Color"}
						pl={3}
						onChange={setNewFolderColor}
					/>
				</Flex>

				<Divider pt={3} mb={3} />
				<Flex justifyContent={"center"} m={"auto"} pt={2} mb={4}>
					<RenderTag color={catInfo?.cat_color} size="lg">
						{catInfo?.cat_name}
					</RenderTag>
				</Flex>

				<Flex mb={2} justifyContent={"center"}>
					<Button onClick={handleSubmit} rightIcon={<BiCategoryAlt />} colorScheme={"whatsapp"}>
						Add Category
					</Button>
				</Flex>
			</Box>
		</>
	)
}
