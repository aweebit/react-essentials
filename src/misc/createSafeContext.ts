import { type Context, type Provider, createContext, useContext } from 'react';
import type { ArgumentFallback } from '../utils.js';

const moValueSymbol = Symbol('noValue');

/**
 * A React context with a required `displayName` and the obsolete `Consumer`
 * property purposefully omitted so that it is impossible to pass the context
 * as an argument to `useContext` or `use` (the hook produced with
 * {@linkcode createSafeContext} should be used instead)
 *
 * @see {@linkcode createSafeContext}
 */
// The type is conditional so that both React 18 and 19 are correctly supported.
// The code duplication is necessary for the type to be displayed correctly by
// TypeDoc.
export type RestrictedContext<T> =
  Context<T> extends Provider<T>
    ? { Provider: Provider<T>; displayName: string } & Provider<T>
    : { Provider: Provider<T>; displayName: string };

/**
 * @see {@linkcode createSafeContext}
 */
export type SafeContext<DisplayName extends string, T> = {
  [K in `${DisplayName}Context`]: RestrictedContext<T>;
} & {
  [K in `use${DisplayName}`]: () => T;
};

/**
 * For a given type `T`, returns a function that produces both a context of that
 * type and a hook that returns the current context value if one was provided,
 * or throws an error otherwise
 *
 * @example
 * ```tsx
 * const { ItemsContext, useItems } = createSafeContext<string[]>()('Items');
 *
 * const Parent = () => (
 *   <ItemsContext value={['compass', 'newspaper', 'banana']}>
 *     <Child />
 *   </ItemsContext>
 * );
 *
 * const Child = () => useItems().join(', ');
 * ```
 *
 * @returns
 * A function that accepts a single string argument `displayName` (e.g.
 * `"Items"`) and returns an object with the following properties:
 * - ``` `${displayName}Context` ``` (e.g. `ItemsContext`): the context
 * - ``` `use${displayName}` ``` (e.g. `useItems`): a hook that returns the
 *   current context value if one was provided, or throws an error otherwise
 */
export function createSafeContext<T = never>() {
  return <DisplayName extends string>(
    displayName: [T] extends [never]
      ? never
      : ArgumentFallback<DisplayName, never, string>,
  ): SafeContext<DisplayName, T> => {
    const contextName = `${displayName as DisplayName}Context` as const;
    const hookName = `use${displayName as DisplayName}` as const;

    const Context = createContext<T | typeof moValueSymbol>(moValueSymbol);
    Context.displayName = contextName;

    return {
      [contextName]: Context as RestrictedContext<T>,
      [hookName]: () => {
        const value = useContext(Context);
        if (value === moValueSymbol) {
          throw new Error(`No ${contextName} value was provided`);
        }
        return value;
      },
    } as {
      [K in typeof contextName]: RestrictedContext<T>;
    } & {
      [K in typeof hookName]: () => T;
    };
  };
}
