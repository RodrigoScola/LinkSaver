import { Category } from 'shared';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loopAsync } from '../utils/formatting/utils';
import { getData } from '../class/serverBridge';

type ICategoryContext = {
	categories: Category[]
	SetCategories: (category: Category[]) => void
	AddCategory: (category: Category) => void
	GetCategory: (id: number) => Promise<Category | undefined>
};



const CategoryContext = createContext<ICategoryContext | null>(null)


export function CategoryProvider({ children }) {

	const [categories, setCategories] = useState<Record<number, Category>>({})

	async function GetCategory(id: number): Promise<Category | undefined> {
		return id in categories ? Promise.resolve(categories[id]) : getData.getPost('categories', id)
	}

	function AddCategory(category: Category) {
		setCategories(curr => ({ ...curr, [category.id]: category }))
	}

	function SetCategories(cats: Category[]) {
		setCategories(cats)
	}


	return <CategoryContext.Provider value={{

		GetCategory,
		AddCategory,
		SetCategories,

		categories: Object.values(categories)

	}}>
		{children}
	</CategoryContext.Provider>
}

export const useCategories = () => {

	const ctx = useContext(CategoryContext)

	if (!ctx) {
		throw new Error('invalid categories')
	}

	return ctx

};
