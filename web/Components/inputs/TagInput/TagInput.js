import { useCallback, useContext, useEffect, useMemo } from "react"
import { Flex } from "@chakra-ui/react"

import { obj } from "../../../utils/formatting/ObjectFormat"
import { RenderTag } from "../../RenderTag"
import { useDispatch, useSelector } from "react-redux"
import { addItem, selectItem } from "./TagInputSlice"
import { isDifferent } from "../../../utils/formatting/utils"

import { TagInputContext } from "../../../context/TagInputContext"

export const TagInput = ({ name, totalTags = [], onSelectChange = () => {}, onItemChange = () => {}, ...props }) => {
	const nitems = useSelector((state) => state.tagInput.items)

	const items = useMemo(() => nitems.filter((item) => item.name == name), [nitems, name])
	const s = useMemo(() => items.filter((item) => item.isSelected), [items])
	const dispatch = useDispatch()

	const options = useContext(TagInputContext)

	const changeItem = useCallback(
		(id) => {
			dispatch(selectItem({ id, name }))
			const item = items[id]
			if (typeof onItemChange !== "undefined") {
				onItemChange(item)
			}
		},
		[onItemChange, dispatch]
	)

	useEffect(() => {
		if (totalTags) {
			const ids = obj.getUniques(totalTags, "id")
			const objId = obj.getUniques(items, "id")
			if (isDifferent(ids, objId)) {
				totalTags.map((items, idx) => {
					dispatch(
						addItem({
							name,
							text: items.cat_name,

							isSelected: items.isSelected || options.defaultSelected || false,
							...items,
						})
					)
				})
			}
		}
	}, [totalTags, dispatch, items, name, options.defaultSelected])

	useEffect(() => {
		onSelectChange(s)
	}, [s, onSelectChange])

	return (
		<Flex justifyContent={"center"} gap={3} {...props} wrap={"wrap"}>
			{items?.map((item, idx) => {
				return (
					<RenderTag
						size={"md"}
						m={1}
						shadow={item?.isSelected ? "inset 2px -2px" : "inset -2px 2px"}
						colorScheme={"blue"}
						variant={"outline"}
						key={idx + "tagItemInput + name" + name}
						onClick={() => {
							changeItem(item.id)
						}}
						color={item?.isSelected == true ? (item?.cat_color ? item?.cat_color : "green") : "gray"}
						text={item?.text}
					></RenderTag>
				)
			})}
		</Flex>
	)
}
