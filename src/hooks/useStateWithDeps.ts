/**
 * @file Based on {@link https://github.com/peterjuras/use-state-with-deps}
 *
 * @license MIT
 * @copyright 2020 Peter Juras
 */

import {
  useCallback,
  useRef,
  type DependencyList,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { depsAreEqual, isFunction } from '../utils.js';
import { useForceUpdate } from './useForceUpdate.js';

/**
 * `useState` hook with an additional dependency array `deps` that resets the
 * state to `initialState` when dependencies change
 *
 * @param initialState The value to which the state is set when the component is
 * mounted or dependencies change
 *
 * It can also be a function that returns a state value. If the state is reset
 * due to a change of dependencies, this function will be passed the previous
 * state as its argument (will be `undefined` in the first call upon mount).
 *
 * @param deps Dependencies that reset the state to `initialState`
 */
export function useStateWithDeps<S>(
  initialState: S | ((previousState?: S) => S),
  deps: DependencyList,
): [S, Dispatch<SetStateAction<S>>] {
  // It would be possible to use useState instead of
  // useRef to store the state, however this would
  // trigger re-renders whenever the state is reset due
  // to a change in dependencies. In order to avoid these
  // re-renders, the state is stored in a ref and an
  // update is triggered via forceUpdate below when necessary
  const state = useRef(undefined as S);

  const prevDeps = useRef(deps);
  const isMounted = useRef(false);

  // If first render, or if dependencies have changed since last time
  if (!isMounted.current || !depsAreEqual(prevDeps.current, deps)) {
    // Update state and deps
    let nextState: S;
    if (isFunction(initialState)) {
      nextState = initialState(state.current);
    } else {
      nextState = initialState;
    }
    state.current = nextState;
    prevDeps.current = deps;
    isMounted.current = true;
  }

  const [forceUpdate] = useForceUpdate();

  const updateState = useCallback(function updateState(
    newState: S | ((previousState: S) => S),
  ): void {
    let nextState: S;
    if (isFunction(newState)) {
      nextState = newState(state.current);
    } else {
      nextState = newState;
    }
    if (!Object.is(state.current, nextState)) {
      state.current = nextState;
      forceUpdate();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [state.current, updateState];
}
