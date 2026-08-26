import { useState, useEffect } from 'react';

/**
 * Custom React Hook: useDebounce
 * Delays updating the debounced value until after the specified delay (ms).
 * Useful for optimizing search filtering and avoiding excessive renders on every keystroke.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debounced value after specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer if value changes before delay completes or on component unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
