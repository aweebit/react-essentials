import { type Provider, createContext, useContext } from 'react';
import type { ArgumentFallback } from '../utils.js';

/**
 * A React context with a required `displayName` and the obsolete `Consumer`
 * property purposefully omitted so that it is impossible to pass the context
 * as an argument to `useContext` or `use` (the hook produced with
 * {@linkcode createSafeContext} should be used instead)
 */
export interface RestrictedContext<T> extends Provider<T> {
  Provider: Provider<T>;
  displayName: string;
}

export type SafeContext<DisplayName extends string, T> =
  ArgumentFallback<DisplayName, never, string> extends never
    ? never
    : { [K in `${DisplayName}Context`]: RestrictedContext<T> } & {
        [K in `use${DisplayName}`]: () => T;
      };

/**
 * For a given type `T`, returns a function that produces both a context of that
 * type and a hook that throws if a context value is required but none was
 * provided, or returns the context's value otherwise
 *
 * @param options
 * An optional configuration object with the property `optional` that, when set
 * to `true`, results in the context value type being `T | undefined` and no
 * errors being thrown when no context value was provided
 *
 * @returns
 * A function that accepts a single string argument `displayName`
 * (e.g. `"Items"`) and returns an object with the following properties:
 * - ``` `${displayName}Context` ``` (e.g. `ItemsContext`): the context
 * - ``` `use${displayName}` ``` (e.g. `useItems`): a hook that returns the
 *   context value, ensuring that one is provided unless it is optional
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function createSafeContext<T extends {} | null = never>(options?: {
  optional?: false | undefined;
}): <DisplayName extends string>(
  displayName: [T] extends [never]
    ? never
    : ArgumentFallback<DisplayName, never, string>,
) => SafeContext<DisplayName, T>;

export function createSafeContext<T>(options: {
  optional: true;
}): <DisplayName extends string>(
  displayName: [T] extends [never]
    ? never
    : ArgumentFallback<DisplayName, never, string>,
) => SafeContext<DisplayName, T | undefined>;

export function createSafeContext<T>({
  optional = false,
}: { optional?: boolean | undefined } = {}) {
  return <DisplayName extends string>(
    displayName: [T] extends [never]
      ? never
      : ArgumentFallback<DisplayName, never, string>,
  ) => {
    const contextName = `${displayName}Context` as const;
    const hookName = `use${displayName}` as const;

    const Context = createContext<T | undefined>(undefined);
    Context.displayName = contextName;

    return optional
      ? {
          [contextName]: Context,
          [hookName]: () => useContext(Context),
        }
      : {
          [contextName]: Context,
          [hookName]: () => {
            const value = useContext(Context);
            if (value === undefined) {
              throw new Error(`No ${contextName} value was provided`);
            }
            return value;
          },
        };
  };
}
