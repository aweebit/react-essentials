/**
 * @file Based on {@link https://github.com/peterjuras/use-state-with-deps}
 *
 * @license MIT
 *
 * Copyright (c) 2020 Peter Juras
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
  useCallback,
  useRef,
  type DependencyList,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { depsAreEqual, isFunction } from '../utils';
import useForceUpdate from './useForceUpdate';

/**
 * `useState` hook with an additional dependency array that resets
 * the state to the `initialState` param when the dependencies passed
 * in the `deps` array change.
 *
 * @param initialState
 * The state that will be set when the component mounts or the
 * dependencies change.
 *
 * It can also be a function which resolves to the state. If the state
 * is reset due to a change of dependencies, this function will be called with the previous
 * state (`undefined` for the first call upon mount).
 * @param deps Dependencies for this hook that resets the state to `initialState`
 */
export default function useDerivedState<S>(
  initialState: S | ((previousState?: S) => S),
  deps: DependencyList,
): [S, Dispatch<SetStateAction<S>>] {
  const isMounted = useRef(false);

  // Determine initial state
  let usableInitialState: S | null = null;
  if (!isMounted.current) {
    isMounted.current = true;
    if (isFunction(initialState)) {
      usableInitialState = initialState();
    } else {
      usableInitialState = initialState;
    }
  }

  // It would be possible to use useState instead of
  // useRef to store the state, however this would
  // trigger re-renders whenever the state is reset due
  // to a change in dependencies. In order to avoid these
  // re-renders, the state is stored in a ref and an
  // update is triggered via forceUpdate below when necessary
  const state = useRef(usableInitialState as S);

  // Check if dependencies have changed
  const prevDeps = useRef(deps);
  if (!depsAreEqual(prevDeps.current, deps)) {
    // Update state and deps
    let nextState: S;
    if (isFunction(initialState)) {
      nextState = initialState(state.current);
    } else {
      nextState = initialState;
    }
    state.current = nextState;
    prevDeps.current = deps;
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
