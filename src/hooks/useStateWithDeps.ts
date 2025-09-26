import {
  useState,
  type DependencyList,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { depsAreEqual } from '../utils.js';

/**
 * `useState` hook with an additional dependency array `deps` that resets the
 * state to `initialState` when dependencies change
 *
 * Due to React's limitations, a change in dependencies always causes two
 * renders when using this hook. The result of the first render is thrown away
 * as described in
 * [useState > Storing information from previous renders](https://react.dev/reference/react/useState#storing-information-from-previous-renders).
 *
 * For motivation and more examples, see
 * https://github.com/facebook/react/issues/33041.
 *
 * @example
 * ```tsx
 * type Activity = 'breakfast' | 'exercise' | 'swim' | 'board games' | 'dinner';
 *
 * const timeOfDayOptions = ['morning', 'afternoon', 'evening'] as const;
 * type TimeOfDay = (typeof timeOfDayOptions)[number];
 *
 * const activityOptionsByTimeOfDay: {
 *   [K in TimeOfDay]: [Activity, ...Activity[]];
 * } = {
 *   morning: ['breakfast', 'exercise', 'swim'],
 *   afternoon: ['exercise', 'swim', 'board games'],
 *   evening: ['board games', 'dinner'],
 * };
 *
 * function Example() {
 *   const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
 *
 *   const activityOptions = activityOptionsByTimeOfDay[timeOfDay];
 *   const [activity, setActivity] = useStateWithDeps<Activity>(
 *     (prev) => {
 *       // Make sure activity is always valid for the current timeOfDay value,
 *       // but also don't reset it unless necessary:
 *       return prev && activityOptions.includes(prev) ? prev : activityOptions[0];
 *     },
 *     [activityOptions],
 *   );
 *
 *   return '...';
 * }
 * ```
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
  const [state, setState] = useState(initialState);

  const [prevDeps, setPrevDeps] = useState(deps);

  if (!depsAreEqual(deps, prevDeps)) {
    setPrevDeps(deps);
    setState(initialState);
  }

  return [state, setState];
}
