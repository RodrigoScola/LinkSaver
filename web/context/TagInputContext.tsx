import { createContext } from 'react';

export type TagInputContextType = {
	name: string;
	defaultSelected: boolean;
};

export const TagInputContext = createContext<TagInputContextType>({
	defaultSelected: false,
	name: '',
});

export const TagInputProvider = ({
	name,
	defaultSelected,
	children,
}: {
	name: string;
	defaultSelected: boolean;
	children: React.ReactNode;
}) => {
	return (
		<TagInputContext.Provider
			value={{
				name,
				defaultSelected,
			}}>
			{children}
		</TagInputContext.Provider>
	);
};
