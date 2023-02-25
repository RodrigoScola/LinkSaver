import { createContext } from "react"

export const TagInputContext = createContext({ defaultSelected: false })

export const TagInputProvider = ({ name, defaultSelected, children }) => {
	return (
		<TagInputContext.Provider
			value={{
				name,
				defaultSelected,
			}}
		>
			{children}
		</TagInputContext.Provider>
	)
}
