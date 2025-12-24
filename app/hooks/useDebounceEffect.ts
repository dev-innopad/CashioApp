import { useEffect, useRef } from 'react';

export function useDebouncedEffect(
	callback: () => void,
	deps: any[],
	delay: number = 3000
) {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const isFirstRun = useRef(true);

	useEffect(() => {
		if (isFirstRun.current) {
			callback(); // run immediately on first mount
			isFirstRun.current = false;
			return;
		}

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			callback();
		}, delay);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, deps);
}
