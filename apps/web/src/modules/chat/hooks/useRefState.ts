import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react';

/**
 * State whose latest value is also mirrored in a ref, so async callbacks can
 * read the current value without stale closures.
 */
export function useRefState<T>(initialValue: T) {
  const [value, setValueState] = useState<T>(initialValue);
  const ref = useRef<T>(value);

  const setValue = useCallback((next: SetStateAction<T>) => {
    setValueState((current) => {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(current) : next;
      ref.current = resolved;
      return resolved;
    });
  }, []);

  return [value, setValue, ref] as const;
}

export type RefStateDispatch<T> = Dispatch<SetStateAction<T>>;
