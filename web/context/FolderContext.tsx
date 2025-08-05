import React, { createContext, useEffect } from 'react';
import { Folder } from 'shared';

type IfolderContext = {
	folder: Folder;
	isCreator: boolean;
	parent_folder?: Folder;
};

export const FolderContext = createContext<IfolderContext>({ isCreator: false, folder: {} as Folder });

export const FolderProvider = ({ baseFolder, children }: { baseFolder: Folder; children: React.ReactNode }) => {
	useEffect(() => {}, []);

	return (
		<FolderContext.Provider
			value={{
				//TODO: FIX THIS
				isCreator: true,
				folder: baseFolder,
			}}>
			{children}
		</FolderContext.Provider>
	);
};

export function useFolder() {
	const context = React.useContext(FolderContext);
	if (!context) {
		throw new Error('useFolder must be used within a FolderProvider');
	}
	return context;
}
