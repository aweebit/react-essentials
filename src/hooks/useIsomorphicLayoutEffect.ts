import {
  useEffect,
  useLayoutEffect,
  type DependencyList,
  type EffectCallback,
} from 'react';

/**
 * Identical to {@linkcode useLayoutEffect}, except it does not result in
 * warnings when used on the server
 *
 * @group Functions
 */
export const useIsomorphicLayoutEffect: (
  effect: EffectCallback,
  deps?: DependencyList,
) => void = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
