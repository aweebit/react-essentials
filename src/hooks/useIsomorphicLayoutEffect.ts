import {
  useEffect,
  useLayoutEffect,
  type DependencyList,
  type EffectCallback,
} from 'react';

/**
 * Identical to `useLayoutEffect`, except it does not result in warnings when
 * used on the server
 */
export const useIsomorphicLayoutEffect: (
  effect: EffectCallback,
  deps?: DependencyList,
) => void = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
