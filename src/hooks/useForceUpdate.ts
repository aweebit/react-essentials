import { useReducer, useRef } from 'react';

/* eslint-disable */
import type { useStateWithDeps } from './useStateWithDeps.js';
import type { useReducerWithDeps } from './useReducerWithDeps.js';
/* eslint-enable */

/**
 * Enables you to imperatively trigger re-rendering of components
 *
 * This hook is designed in the most general way possible in order to cover all
 * imaginable use cases.
 *
 * @example
 * Sometimes, React's immutability constraints mean too much unnecessary copying
 * of data when new data arrives at a high frequency. In such cases, it might be
 * desirable to ignore the constraints by embracing imperative patterns.
 * Here is an example of a scenario where that can make sense:
 *
 * ```tsx
 * type SensorData = { timestamp: number; value: number };
 * const sensorDataRef = useRef<SensorData[]>([]);
 * const mostRecentSensorDataTimestampRef = useRef<number>(0);
 *
 * const [forceUpdate, updateCount] = useForceUpdate();
 * // Limiting the frequency of forced re-renders with some throttle function:
 * const throttledForceUpdateRef = useRef(throttle(forceUpdate));
 *
 * useEffect(() => {
 *   return sensorDataObservable.subscribe((data: SensorData) => {
 *     // Imagine new sensor data arrives every 1 millisecond. If we were following
 *     // React's immutability rules by creating a new array every time, the data
 *     // that's already there would have to be copied many times before the new
 *     // data would even get a chance to be reflected in the UI for the first time
 *     // because it typically takes much longer than 1 millisecond for a new frame
 *     // to be displayed. To prevent the waste of computational resources, we just
 *     // mutate the existing array every time instead:
 *     sensorDataRef.current.push(data);
 *     if (data.timestamp > mostRecentSensorDataTimestampRef.current) {
 *       mostRecentSensorDataTimestampRef.current = data.timestamp;
 *     }
 *     throttledForceUpdateRef.current();
 *   });
 * }, []);
 *
 * const [timeWindow, setTimeWindow] = useState(1000);
 * const selectedSensorData = useMemo(
 *   () => {
 *     // Keep this line if you don't want to disable the
 *     // react-hooks/exhaustive-deps ESLint rule:
 *     updateCount;
 *     const threshold = mostRecentSensorDataTimestampRef.current - timeWindow;
 *     return sensorDataRef.current.filter(
 *       ({ timestamp }) => timestamp >= threshold,
 *     );
 *   },
 *   // sensorDataRef.current always references the same array, so listing it as a
 *   // dependency is pointless. Instead, updateCount should be used:
 *   [updateCount, timeWindow],
 * );
 * ```
 *
 * @param callback An optional callback function to call during renders that
 * were triggered with `forceUpdate()`
 *
 * Can be used for conditionally calling state setters when state needs to be
 * reset. That is legal and better than using effects (see
 * {@link https://react.dev/learn/-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes You Might Not Need an Effect > Adjusting some state when a prop changes}),
 * but can often be avoided by using {@linkcode useStateWithDeps} or
 * {@linkcode useReducerWithDeps}.
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
export function useForceUpdate(callback?: () => void): [() => void, bigint] {
  // It is very unlikely that the number of updates will exceed
  // Number.MAX_SAFE_INTEGER, but not impossible. That is why we use bigints.
  const [updateCount, forceUpdate] = useReducer((prev) => prev + 1n, 0n);
  const updateCountRef = useRef(updateCount);
  if (updateCount !== updateCountRef.current) {
    updateCountRef.current = updateCount;
    callback?.();
  }
  return [forceUpdate, updateCount];
}
