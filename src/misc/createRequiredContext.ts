import { createContext, type Provider, useContext } from 'react';
import { capitalize } from '../utils.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { createGranularContext } from './createGranularContext.js';

const moContextValueSymbol = Symbol(
  '@aweebit/react-essentials/no-context-value',
);

/**
 * For a given type `T`, returns a function that generates a context of that
 * type, and returns both a provider component and a hook for that context where
 * the hook will throw if no context value has been provided
 *
 * The advantages over vanilla {@linkcode createContext} are that no default
 * value has to be specified, and that a meaningful context name is displayed in
 * dev tools instead of generic `Context.Provider`.
 *
 * {@linkcode createGranularContext} is a more high-level API built on top of
 * this function. Using it should be preferred to using `createRequiredContext`
 * directly in cases where the context value is part of the UI state.
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
 * // Before:
 * const DirectionContext = createContext<Direction | undefined>(undefined);
 * DirectionContext.displayName = 'DirectionContext';
 *
 * const DirectionProvider = DirectionContext.Provider;
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
 * // After:
 * const { DirectionProvider, useDirection } =
 *   createRequiredContext<Direction>()('Direction'); // That's it :)
 *
 * const Parent = () => (
 *   // Providing undefined as the value is not allowed 👍
 *   <DirectionProvider value={Direction.Up}>
 *     <Child />
 *   </DirectionProvider>
 * );
 *
 * const Child = () => `Provided direction: ${Direction[useDirection()]}`;
 * ```
 *
 * @returns
 * A function that accepts a single string argument `name` (e.g. `"Direction"`)
 * and returns an object with the following properties:
 * - ``` `${capitalize(name)}Provider` ``` (e.g. `DirectionProvider`): the
 *   context provider
 * - ``` `use${capitalize(name)}` ``` (e.g. `useDirection`): a hook that returns
 *   the current context value if one was provided, or throws an error otherwise
 *
 * @see
 * {@linkcode createGranularContext}
 */
export function createRequiredContext<T = never>() {
  return <Name extends string>(
    name: [T] extends [never] ? never : string extends Name ? never : Name,
  ): {
    [K in `${Capitalize<Name>}Provider`]: Provider<T>;
  } & {
    [K in `use${Capitalize<Name>}`]: () => T;
  } => {
    const capitalizedName = capitalize(name as Name);
    const providerName = `${capitalizedName}Provider` as const;
    const hookName = `use${capitalizedName}` as const;

    const Context = createContext<T | typeof moContextValueSymbol>(
      moContextValueSymbol,
    );
    Context.displayName = `${capitalizedName}Context`;

    return {
      [providerName]: Context.Provider as Provider<T>,
      [hookName]: () => {
        const value = useContext(Context);
        if (value === moContextValueSymbol) {
          throw new Error(`No ${Context.displayName} value was provided`);
        }
        return value;
      },
    } as {
      [K in typeof providerName]: Provider<T>;
    } & {
      [K in typeof hookName]: () => T;
    };
  };
}
