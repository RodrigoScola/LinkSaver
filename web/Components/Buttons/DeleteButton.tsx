import { Button, Spinner, } from "@chakra-ui/react"
import { useContext } from "react"
import { VscTrash } from "react-icons/vsc"
import { PostContext, usePost } from "../../context/PostContext"
import { useFetch } from "../../hooks/useFetch"
export const DeleteButton = ({ ...props }) => {


	const post = usePost()

	const { data, isLoading, setUrl } = useFetch("", {
		method: "DELETE",
	})

	const deletePost = () => {
		if (data) {
			setUrl("")
		} else {
			const postId = post.post.id

			setUrl("/posts/" + postId)
		}
	}

	return (
		<Button
			{...props}
			colorScheme={"red"}
			variant={"outline"}
			rightIcon={isLoading == true ? <></> : <VscTrash />}
			isDisabled={isLoading}
			onClick={deletePost}
		>
			{isLoading == true ? <Spinner /> : "Delete"}
		</Button>
	)
}
