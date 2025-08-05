import { Category, PartialBy } from 'shared';
import { createContext, ReactNode, useContext, useState } from 'react';
import { getData } from '../class/serverBridge';

type ICategoryContext = {
	categories: Category[];
	SetCategories: (category: Category[]) => void;
	AddCategory: (category: Category) => void;
	GetCategory: (id: number) => Promise<Category | undefined>;
	PostCategory: (category: PartialBy<Category, 'id'>) => Promise<Category | undefined>;
};

const CategoryContext = createContext<ICategoryContext | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
	const [categories, setCategories] = useState<Record<number, Category>>({});

	async function GetCategory(id: number): Promise<Category | undefined> {
		return id in categories ? Promise.resolve(categories[id]) : getData.get(`/categories/${id}`);
	}

	function AddCategory(category: Category) {
		setCategories((curr) => ({ ...curr, [category.id]: category }));
	}

	function SetCategories(cats: Category[]) {
		setCategories(cats);
	}

	function PostCategory(cat: PartialBy<Category, 'id'>): Promise<Category | undefined> {
		return getData.post('categories', cat).then((data) => {
			if (data && 'id' in data) {
				AddCategory(data as Category);
				return data as Category;
			}
			return undefined;
		});
	}

	return (
		<CategoryContext.Provider
			value={{
				GetCategory,
				AddCategory,
				SetCategories,
				PostCategory,

				categories: Object.values(categories),
			}}>
			{children}
		</CategoryContext.Provider>
	);
}

export const useCategories = () => {
	const ctx = useContext(CategoryContext);

	if (!ctx) {
		throw new Error('invalid categories');
	}

	return ctx;
};
