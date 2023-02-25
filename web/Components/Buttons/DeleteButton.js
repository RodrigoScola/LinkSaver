import { Button, Spinner, } from "@chakra-ui/react"
import { useContext} from "react"
import { VscTrash } from "react-icons/vsc"
import { PostContext } from "../../context/PostContext"
import { useFetch } from "../../hooks/useFetch"
export const DeleteButton = ({ ...props }) => {
	const post = useContext(PostContext)
	const { data,  isLoading, setUrl } = useFetch("", {
		method: "DELETE",
	})

	const handleDelete = () => {
		if (data) {
			setUrl("")
		} else {
			const postId = post.id
			setUrl("/posts/" + postId)
		}
	}

	return (
		<Button
			{...props}
			colorScheme={"red"}
			variant={"outline"}
			rightIcon={isLoading == true ? null : <VscTrash />}
			isDisabled={isLoading == true}
			onClick={handleDelete}
		>
			{isLoading == true ? <Spinner /> : "Delete"}
		</Button>
	)
}
