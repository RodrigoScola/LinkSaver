import { Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { isDifferent } from "../../utils/formatting/utils"
import { RenderTag } from "../RenderTag"
export const RenderCategories = ({ categories, catprops, ...rest }) => {
	return (
		<Flex wrap={"wrap"} gap={1} {...rest}>
			{categories?.map((category, cat_key) => {
				return <RenderTag key={cat_key} color={category?.cat_color} {...catprops} text={category?.cat_name} />
			})}
		</Flex>
	)
}
