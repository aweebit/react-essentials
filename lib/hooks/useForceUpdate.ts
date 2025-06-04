import { useReducer, useRef } from 'react';

/**
 * Enables you to imperatively trigger re-rendering of components
 *
 * This hook is designed in the most general way possible in order to cover all
 * imaginable use cases.
 *
 * @param callback An optional callback function to call during renders that
 * were triggered with `forceUpdate()`
 *
 * Can be used for conditionally calling state setters when state needs to be
 * reset. That is legal and better than using effects (see
 * {@link https://react.dev/learn/-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes You Might Not Need an Effect > Adjusting some state when a prop changes}),
 * but can often be avoided by using
 * [`useStateWithDeps`]({@link ./useStateWithDeps.ts}) or
 * [`useReducerWithDeps`]({@link ./useReducerWithDeps.ts}).
 *
 * Important: the callback function is called once per render, not once per
 * `forceUpdate` call! If React batches `forceUpdate` calls, then it will only
 * be called once.
 *
 * @returns An array with the following two elements:
 *
 * 1. A `forceUpdate` function that triggers a re-render
 * 2. The number of times `forceUpdate` has been called so far
 */
export default function useForceUpdate(
  callback?: () => void,
): [() => void, bigint] {
  // It is very unlikely that the number of updates will exceed
  // Number.MAX_SAFE_INTEGER, but not impossible. That is why we use bigints.
  const [counter, forceUpdate] = useReducer((prev) => prev + 1n, 0n);
  const counterRef = useRef(counter);
  if (counter !== counterRef.current) {
    counterRef.current = counter;
    callback?.();
  }
  return [forceUpdate, counter];
}
