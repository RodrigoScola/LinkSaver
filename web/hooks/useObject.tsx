import { useState, useCallback, useMemo } from 'react';

export function useObject<T>(initialState?: T) {
	const [value, setObject] = useState<T>(initialState || ({} as T));

	const updateObject = useCallback((newObject: Partial<T>) => {
		setObject((prev) => {
			return { ...prev, ...newObject } as T;
		});
	}, []);

	const Set = useCallback((newObject: T) => {
		setObject(newObject);
	}, []);

	return useMemo(
		() => ({
			value: value,
			update: updateObject,
			set: Set,
		}),
		[value, updateObject]
	);
}
