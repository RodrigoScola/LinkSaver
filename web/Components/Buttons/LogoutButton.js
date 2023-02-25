import { Button } from "@chakra-ui/react"
import { useDispatch } from "react-redux"
import { logout } from "../../store/user/userSlice"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { VscSignOut } from "react-icons/vsc"
import { useRouter } from "next/router"

export const LogoutButton = () => {
	const dispatch = useDispatch()
	const supabase = useSupabaseClient()
	const router = useRouter()
	const handleLogout = async () => {
		await supabase.auth.signOut()
		dispatch(logout())
		router.push("/login")
	}
	return (
		<Button colorScheme={"red"} rightIcon={<VscSignOut />} onClick={handleLogout}>
			Log Out
		</Button>
	)
}
