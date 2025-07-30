import { Box, Input } from "@chakra-ui/react"
import { useCategories } from "../../hooks/useCategories"
import { obj } from "../../utils/formatting/ObjectFormat"
import { FormInput } from "../inputs/FormInput"
import { SelectCategory } from "./SelectCategory"
import { SelectFolder } from "./SelectFolder"
import { Category, Post } from 'shared'
import { title } from 'process'
import { ChangeEvent } from 'react'
export const EditPostCard = ({
	onChange = () => { },
	categories,
}: {

	post: Post,
	onChange: (e: ChangeEvent<HTMLInputElement>) => void,
	categories: Category[]


}) => {

	return (
		<Box>
			<FormInput width={"full"} labelText={"post title"}>
				<Input
					width={"full"}
					onChange={(e) => onChange(e)}
					defaultValue={title}
					name="title"
				/>
			</FormInput>
			<FormInput width={"full"} labelText={"post url"}>
				<Input
					width={"full"}
					onChange={(e) => onChange({ [e.target.name]: e.target.value })}
					defaultValue={post_url}
					name="post_url"
				/>
			</FormInput>

			<SelectCategory
				onChange={(items) => onChange({ categories: obj.getUniques(items, "id") })}
				name={"updatePost" + id}
				defaultSelected={true}
				baseCategories={categories}
			/>
			<SelectFolder />
		</Box>
	)
}
