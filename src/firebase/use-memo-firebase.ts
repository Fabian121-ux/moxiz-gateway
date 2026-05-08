
'use client';

import { useMemo } from 'react';

/**
 * A hook to memoize Firebase references or queries.
 * It ensures that the memoized value is only updated when the dependencies change, 
 * preventing infinite loops in Firebase hooks like useCollection or useDoc 
 * that depend on object identity.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
