import { RadioGroup, Radio, ListItem, List } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"

import { toObj } from "../../utils/formatting/ObjectFormat"
export const FolderListInput = ({ folders = [], onChange: h = () => {}, selected: selectedItem }) => {
	const [selected, setSelected] = useState({})
	const handleChange = useCallback(
		(id) => {
			const item = toObj(folders)[id]
			setSelected(item)
		},
		[folders, setSelected]
	)
	const onChange = useCallback((i) => h(i), [h])
	useEffect(() => {
		if (selectedItem) {
			if (typeof selectedItem == "number") {
				handleChange(selectedItem)
			} else {
				handleChange(selectedItem.id)
			}
		}
	}, [selectedItem, handleChange])

	useEffect(() => {
		if (selected) {
			onChange(selected)
		}
	}, [selected])
	return (
		<RadioGroup onChange={handleChange} defaultValue={""} value={String(selected?.id)}>
			<List>
				{folders?.map((folder, i) => {
					if (folder) {
						return (
							<ListItem key={i} listStyleType={"none"}>
								<Radio value={String(folder.id)}>{folder.name}</Radio>
							</ListItem>
						)
					}
				})}
			</List>
		</RadioGroup>
	)
}
