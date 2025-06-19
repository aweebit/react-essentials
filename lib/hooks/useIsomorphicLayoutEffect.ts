import { useLayoutEffect } from 'react';
import { noop } from '../utils/index.ts';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : noop;
