import { useLayoutEffect } from 'react';
import { noop } from '../utils.js';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : noop;
