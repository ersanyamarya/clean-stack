import { useEffect, useState } from 'react';

export function useDebounceField<T>(
  value: T,
  onDebounced: (value: T) => void,
  delay?: number
): {
  fieldValue: T;
  debounceFieldProps: {
    onChange: (e: { target: { value: T } }) => void;
    value?: T;
  };
  resetFieldValue: () => void;
} {
  const [fieldValue, setFieldValue] = useState<T>(value);
  const [previousFieldValue, setPreviousFieldValue] = useState<T>(value);

  const resetFieldValue = () => {
    if (typeof value === 'string') {
      setFieldValue('' as T);
      setPreviousFieldValue('' as T);
    }
  };

  useEffect(() => {
    if (fieldValue !== previousFieldValue) {
      const timer = setTimeout(() => {
        setPreviousFieldValue(fieldValue);
        onDebounced(fieldValue);
      }, delay || 200);
      return () => clearTimeout(timer);
    }

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValue]);

  return {
    resetFieldValue,
    fieldValue,
    debounceFieldProps: {
      onChange: (e: { target: { value: T } }) => {
        if (fieldValue !== e.target.value) setFieldValue(e.target.value);
      },
      value: fieldValue,
    },
  };
}
