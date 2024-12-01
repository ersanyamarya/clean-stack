import { useEffect, useState } from 'react';

const isPrimitive = (value: any): boolean => {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
};

export function useTypeSafeLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      return isPrimitive(initialValue) ? (item as T) : JSON.parse(item);
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore = isPrimitive(storedValue) ? storedValue : JSON.stringify(storedValue);
      localStorage.setItem(key, valueToStore as string);
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
