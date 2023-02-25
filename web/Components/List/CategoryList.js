import { Box } from "@chakra-ui/react"
import { BASEURL } from "../../utils/formatting/utils"
import { RenderTag } from "../RenderTag"

export const CategoryList = ({ id = null, cat_name = "", cat_color = "" }) => {
	return (
		<Box w={"fit-content"}>
			<a href={`${BASEURL}/categories/${id}`}>
				<RenderTag text={cat_name} color={cat_color} variant={"outline"} />
			</a>
		</Box>
	)
}
