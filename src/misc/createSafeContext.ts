import { type Context, createContext, useContext } from 'react';
import type { ArgumentFallback } from '../utils.js';

const moValueSymbol = Symbol('noValue');

/**
 * For a given type `T`, returns a function that produces both a context of that
 * type and a hook that returns the current context value if one was provided,
 * or throws an error otherwise
 *
 * The advantages over vanilla `createContext` are that no default value has to
 * be provided, and that a meaningful context name is displayed in dev tools
 * instead of generic `Context.Provider`.
 *
 * @example
 * ```tsx
 * enum Direction {
 *   Up,
 *   Down,
 *   Left,
 *   Right,
 * }
 *
 * // Before
 * const DirectionContext = createContext<Direction | undefined>(undefined);
 * DirectionContext.displayName = 'DirectionContext';
 *
 * const useDirection = () => {
 *   const direction = useContext(DirectionContext);
 *   if (direction === undefined) {
 *     // Called outside of a <DirectionContext.Provider> boundary!
 *     // Or maybe undefined was explicitly provided as the context value
 *     // (ideally that shouldn't be allowed, but it is because we had to include
 *     // undefined in the context type so as to provide a meaningful default)
 *     throw new Error('No DirectionContext value was provided');
 *   }
 *   // Thanks to the undefined check, the type is now narrowed down to Direction
 *   return direction;
 * };
 *
 * // After
 * const { DirectionContext, useDirection } =
 *   createSafeContext<Direction>()('Direction'); // That's it :)
 *
 * const Parent = () => (
 *   // Providing undefined as the value is not allowed 👍
 *   <Direction.Provider value={Direction.Up}>
 *     <Child />
 *   </Direction.Provider>
 * );
 *
 * const Child = () => `Current direction: ${Direction[useDirection()]}`;
 * ```
 *
 * @returns
 * A function that accepts a single string argument `displayName` (e.g.
 * `"Direction"`) and returns an object with the following properties:
 * - ``` `${displayName}Context` ``` (e.g. `DirectionContext`): the context
 * - ``` `use${displayName}` ``` (e.g. `useDirection`): a hook that returns the
 *   current context value if one was provided, or throws an error otherwise
 */
export function createSafeContext<T = never>() {
  return <DisplayName extends string>(
    displayName: [T] extends [never]
      ? never
      : ArgumentFallback<DisplayName, never, string>,
  ): { [K in `${DisplayName}Context`]: Context<T> } & {
    [K in `use${DisplayName}`]: () => T;
  } => {
    const contextName = `${displayName as DisplayName}Context` as const;
    const hookName = `use${displayName as DisplayName}` as const;

    const Context = createContext<T | typeof moValueSymbol>(moValueSymbol);
    Context.displayName = contextName;

    return {
      [contextName]: Context as Context<T>,
      [hookName]: () => {
        const value = useContext(Context);
        if (value === moValueSymbol) {
          throw new Error(`No ${contextName} value was provided`);
        }
        return value;
      },
    } as {
      [K in typeof contextName]: Context<T>;
    } & {
      [K in typeof hookName]: () => T;
    };
  };
}
