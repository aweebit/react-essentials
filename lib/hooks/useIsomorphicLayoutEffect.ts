import { useLayoutEffect } from 'react';
import { noop } from '../utils/index.ts';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : noop;

export default useIsomorphicLayoutEffect;
