import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import _ from 'lodash';
import { Folder, PartialBy } from 'shared';
import { getData } from '../class/serverBridge';

type IFolderContext = {
	GetFolder: (id: number) => Promise<Folder | undefined>;
	GetFolders: () => Folder[];
	AddFolder: (folder: Folder) => void;
	UpdateFolder: (folder: Folder) => Promise<Folder | undefined>;
	CreateFolder: (folder: PartialBy<Folder, 'id'>) => Promise<Folder>;
};

export const FolderContext = createContext<IFolderContext | null>(null);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
	const [folders, setFolders] = useState<Record<number, Folder>>({});

	const GetFolder = useCallback((id: number): Promise<Folder> => {
		if (id in folders) {
			return Promise.resolve(folders[id]);
		}

		return getData.get(`/folders/${id}`);
	}, []);

	const GetFolders = (): Folder[] => {
		return Object.values(folders);
	};

	const UpdateFolder = useCallback(async (folder: Folder) => {
		const updated = await getData.update<Folder>(`/folders/${folder.id}`, folder);

		console.log({ updated, folder });

		if (!('id' in updated)) {
			return;
		}

		setFolders((curr) => ({ ...curr, [updated.id]: updated }));

		return updated;
	}, []);

	async function CreateFolder(folder: PartialBy<Folder, 'id'>) {
		const newFolder = await getData.post('/folders', folder);
		AddFolder(newFolder);

		return newFolder;
	}

	function AddFolder(folder: Folder) {
		setFolders((curr) => ({ ...curr, [folder.id]: folder }));
	}

	return (
		<FolderContext.Provider
			value={{
				GetFolders,
				GetFolder,
				UpdateFolder,
				AddFolder,
				CreateFolder,
			}}>
			{children}
		</FolderContext.Provider>
	);
};

export function useFolders() {
	const ctx = useContext(FolderContext);

	if (!ctx) {
		throw new Error(`invalid folder context`);
	}

	return ctx;
}
