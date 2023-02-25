import { BoxCard } from "./cards/BoxCard"
import { Flex, useOutsideClick } from "@chakra-ui/react"
import { PostProvider } from "../context/PostContext"
import { FolderProvider } from "../context/FolderContext"
import { AiOutlineTag } from "react-icons/ai"
import { FolderList } from "./List/FolderList"
import { SearchInput } from "./inputs/SearchInput"
import { Box } from "@chakra-ui/react"
import { useCategories } from "../hooks/useCategories"
import { useFolder } from "../hooks/useFolder"
import { usePosts } from "../hooks/usePosts"

import { PostList } from "./List/PostList"

import { VscFolder } from "react-icons/vsc"
import { useCallback, useMemo, useRef, useState } from "react"

import { toArr, toObj } from "../utils/formatting/ObjectFormat"
import { CategoryList } from "./List/CategoryList"
export const NavSearch = () => {
	const { categories: newCat, setNewIds, ids } = useCategories()
	const { folder, newFolder } = useFolder()

	const { posts, newPost, ids: postIds } = usePosts([])
	const handleResults = useCallback(
		(items) => {
			if (items[0]) {
				items = items[0]

				const catIds = items?.categories?.map((category) => {
					return category.id
				})
				setNewIds(catIds, { strict: true })
				items?.folders?.map((folder) => newFolder(folder))
				items?.posts?.map((post) => newPost(post))
			}
		},
		[setNewIds, newPost, newFolder]
	)
	const categories = useMemo(() => {
		const catObj = toObj(newCat, "id")
		const obj = ids.reduce((curr, id) => {
			if (catObj[id]) {
				curr[id] = catObj[id]
			}
			return curr
		}, {})
		return toArr(obj)
	}, [newCat, ids])

	const boxRef = useRef()

	const [modalOpen, setIsOpen] = useState(false)

	useOutsideClick({
		ref: boxRef,
		handler: () => setIsOpen(false),
	})

	const hasResults = useMemo(() => {
		return folder.length + posts.length + categories.length !== 0
	}, [folder, posts, categories])

	return (
		<Box>
			<Box>
				<Box ref={boxRef} onClick={() => setIsOpen(true)}>
					<SearchInput type="search" onResult={handleResults} />
				</Box>
				{modalOpen == true && hasResults ? (
					<Box ref={boxRef}>
						<BoxCard px={3} mt={4}>
							{folder.length > 0 && (
								<Box>
									<Flex fontWeight={"bold"} alignItems={"center"}>
										<VscFolder /> {/* VscFolderOpened */}
										Folders
									</Flex>
									{folder.map((curr, ind) => {
										return (
											<FolderProvider key={ind} folder={curr}>
												<FolderList />
											</FolderProvider>
										)
									})}
								</Box>
							)}
							{posts.length > 0 && (
								<Box>
									<Flex fontWeight={"bold"} alignItems={"center"}>
										<VscFolder /> {/* VscFolderOpened */}
										Files
									</Flex>
									{posts.map((curr, ind) => {
										return (
											<PostProvider key={ind} post={curr}>
												<PostList />
											</PostProvider>
										)
									})}
								</Box>
							)}

							{categories.length > 0 && (
								<Box>
									<Flex fontWeight={"bold"} alignItems={"center"}>
										<AiOutlineTag />
										{/* aioutlinetags */}
										Categories
									</Flex>
									<Flex gap={2}>
										{categories.map((cat, ind) => {
											return <CategoryList key={ind} {...cat} />
										})}
									</Flex>
								</Box>
							)}
						</BoxCard>
					</Box>
				) : null}
			</Box>
		</Box>
	)
}
