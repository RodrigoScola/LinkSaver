import { useState, useCallback, useMemo } from 'react';

export function useObject<T>(initialState?: T) {
	const [value, setObject] = useState<T>(initialState || ({} as T));

	const updateObject = useCallback((newObject: Partial<T>) => {
		setObject((prev) => {
			return { ...prev, ...newObject } as T;
		});
	}, []);

	return useMemo(
		() => ({
			value: value,
			update: updateObject,
		}),
		[value, updateObject]
	);
}
