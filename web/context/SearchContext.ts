import { useCallback, useState } from 'react';

type SearchTerm<T = any> = {
	name: string;
	term: string;
	results: T | undefined;
};

function createNewTerm<T>() {
	return (options?: Partial<SearchTerm<T>>): SearchTerm<T> => ({
		term: options?.term || '',
		results: options?.results ?? undefined,
		name: options?.name || '',
	});
}

export function useSearch() {
	const [results, setResults] = useState<Record<string, SearchTerm>>({});

	function UpdateSearchData(term: SearchTerm) {
		setResults((prev) => ({
			...prev,
			[term.name]: term,
		}));
	}

	const getSearch = useCallback((term: string): SearchTerm => results[term] || createNewTerm(), [results]);

	function clearResults(name: string) {
		UpdateSearchData({
			name: name,
			term: '',
			results: [],
		});
	}

	return {
		clearResults,
		UpdateSearchData,
		getSearch: getSearch,
		createNewTerm,
	};
}
