import { type DependencyList, useCallback, useRef } from 'react';
import { useStateWithDeps } from './useStateWithDeps.js';

// We cannot simply import the following types from @types/react since they are
// only available starting from React 19, but we also want to support React 18
// whose type declarations for useReducer are very different.

/** @ignore */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyActionArg = [] | [any];

/** @ignore */
export type ActionDispatch<ActionArg extends AnyActionArg> = (
  ...args: ActionArg
) => void;

/**
 * `useReducer` hook with an additional dependency array `deps` that resets the
 * state to `initialState` when dependencies change
 *
 * ### On linter support
 *
 * The `react-hooks/exhaustive-deps` ESLint rule doesn't support hooks where
 * the dependency array parameter is at any other position than the second.
 * However, as we would like to keep the hook as compatible with `useReducer` as
 * possible, we don't want to artificially change the parameter's position.
 * Therefore, there will be no warnings about missing dependencies.
 * Because of that, additional caution is advised!
 * Be sure to check no dependencies are missing from the `deps` array.
 *
 * Related issue: {@link https://github.com/facebook/react/issues/25443}.
 *
 * Unlike `eslint-plugin-react-hooks` maintained by React's team, the unofficial
 * `useExhaustiveDependencies` rule provided for Biome by Biome's team
 * does actually have support for dependency arrays at other positions, see
 * {@link https://biomejs.dev/linter/rules/use-exhaustive-dependencies/#validating-dependencies useExhaustiveDependencies > Options > Validating dependencies}.
 *
 * @param reducer The reducer function that specifies how the state gets updated
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
export function useReducerWithDeps<S, A extends AnyActionArg>(
  reducer: (prevState: S, ...args: A) => S,
  initialState: S | ((previousState?: S) => S),
  deps: DependencyList,
): [S, ActionDispatch<A>] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [state, setState] = useStateWithDeps(initialState, deps);

  // Only the initially provided reducer is used
  const reducerRef = useRef(reducer);

  const dispatch = useCallback(function dispatch(...args: A): void {
    setState((previousState) => reducerRef.current(previousState, ...args));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [state, dispatch];
}
