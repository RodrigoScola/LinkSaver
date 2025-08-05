import { useCallback, useEffect, useRef, useState } from 'react';

export const useDelay = (callback: (...args: any[]) => void, time = 100) => {
	const [isAvailable, setAvailable] = useState(true);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const delayedCallback = useCallback(
		(...args: any[]) => {
			if (!isAvailable) return;

			callback(...args);
			setAvailable(false);

			// Reset availability after delay
			timeoutRef.current = setTimeout(() => {
				setAvailable(true);
			}, time);
		},
		[callback, isAvailable, time]
	);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return {
		isAvailable,
		fn: delayedCallback,
	};
};
