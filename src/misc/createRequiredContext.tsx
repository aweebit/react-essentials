import {
  createContext,
  type FunctionComponent,
  type Provider,
  type ReactNode,
  useContext,
} from 'react';
import { capitalize } from '../utils.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { createGranularContext } from './createGranularContext.js';

const moContextValueSymbol = Symbol(
  '@aweebit/react-essentials/no-context-value',
);

/**
 * The type of {@linkcode createRequiredContext}
 *
 * @see
 * {@linkcode createRequiredContext},
 * {@linkcode CreateRequiredContextWithStandardProvider},
 * {@linkcode CreateRequiredContextWithCustomProvider}
 */
export type CreateRequiredContext = CreateRequiredContextWithStandardProvider &
  CreateRequiredContextWithCustomProvider;

/**
 * @see
 * {@linkcode createRequiredContext}
 */
export type CreateRequiredContextResultHookPart<Name extends string, T> = {
  [K in `use${Capitalize<Name>}`]: () => T;
};

/**
 * @see
 * {@linkcode createRequiredContext},
 * {@linkcode CreateRequiredContextWithStandardProviderResult}
 */
export type CreateRequiredContextWithStandardProvider = <T = never>() => <
  Name extends string,
>(
  name: [T] extends [never] ? never : string extends Name ? never : Name,
) => CreateRequiredContextWithStandardProviderResult<Name, T>;

/**
 * @see
 * {@linkcode createRequiredContext},
 * {@linkcode CreateRequiredContextResultHookPart}
 */
export type CreateRequiredContextWithStandardProviderResult<
  Name extends string,
  T,
> = {
  [K in `${Capitalize<Name>}Provider`]: Provider<T>;
} & CreateRequiredContextResultHookPart<Name, T>;

/**
 * @see
 * {@linkcode createRequiredContext},
 * {@linkcode CreateRequiredContextWithCustomProviderArgs},
 * {@linkcode CreateRequiredContextWithCustomProviderResult}
 */
export type CreateRequiredContextWithCustomProvider = <
  Name extends string,
  T,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Props extends object = {},
>(
  ...args: CreateRequiredContextWithCustomProviderArgs<Name, T, Props>
) => CreateRequiredContextWithCustomProviderResult<Name, T, Props>;

/**
 * @see
 * {@linkcode createRequiredContext}
 */
export type CreateRequiredContextWithCustomProviderArgs<
  Name extends string,
  T,
  Props extends object,
> = [
  name: string extends Name ? never : Name,
  providerHook: (props: Props) => T,
];

/**
 * @see
 * {@linkcode createRequiredContext},
 * {@linkcode CreateRequiredContextWithCustomProviderResultProviderPart},
 * {@linkcode CreateRequiredContextResultHookPart}
 */
export type CreateRequiredContextWithCustomProviderResult<
  Name extends string,
  T,
  Props extends object,
> = CreateRequiredContextWithCustomProviderResultProviderPart<Name, Props> &
  CreateRequiredContextResultHookPart<Name, T>;

/**
 * @see
 * {@linkcode createRequiredContext}
 */
export type CreateRequiredContextWithCustomProviderResultProviderPart<
  Name extends string,
  Props extends object,
> = {
  [K in `${Capitalize<Name>}Provider`]: FunctionComponent<
    Props & { children?: ReactNode | undefined }
  >;
};

/**
 * Generates a context of type `T` and returns both a provider component and a
 * hook for that context where the hook will throw an error if no context value
 * has been provided
 *
 * The advantages over vanilla {@linkcode createContext} are that no default
 * value has to be specified, and that a meaningful context name is displayed in
 * dev tools instead of a generic `Context.Provider`.
 *
 * The following call patterns are available:
 *
 * ```ts
 * createRequiredContext<T>()(name);
 * createRequiredContext(name, providerHook);
 * ```
 *
 * When the first one is used, the standard React context provider is returned.
 * The type `T` has to be specified explicitly. Two calls are necessary due to
 * TypeScript's limitations.
 *
 * The second pattern can be used when it is desired that the provider component
 * incorporates custom reactive logic for context value derivation. The type `T`
 * is inferred as the return type of `providerHook` which is the function where
 * that custom logic resides.
 *
 * For the full definition of the function's type, see
 * {@linkcode CreateRequiredContext}.
 *
 * When multiple related values are provided by a single provider component, it
 * is important that values that update independently from one another are kept
 * in separate contexts because otherwise, unnecessary re-renders are likely to
 * happen. For example, a reactive value and its respective setter function
 * should be put in separate contexts because the former can change, while the
 * latter never changes. To generate contexts like that, please use
 * {@linkcode createGranularContext}.
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
 *
 * // Custom provider example:
 * const { TimeProvider, useTime } = createRequiredContext(
 *   'Time',
 *   ({ startTime = 0 }: { startTime?: number }) => {
 *     const [time, setTime] = useState(startTime);
 *     useEffect(() => {
 *       const interval = setInterval(() => setTime((t) => t + 1), 1000);
 *       return () => clearInterval(interval);
 *     }, []);
 *     return time;
 *   }
 * );
 *
 * const Parent = () => (
 *   <TimeProvider startTime={-30}>
 *     <Child />
 *   </TimeProvider>
 * );
 *
 * const Child = () => `Time: ${useTime()}`;
 * ```
 *
 * @param name
 * A string the context's display name is derived from
 *
 * @param providerHook
 * An optional custom provider hook that receives props passed to the provider
 * component as its argument and should return the context's current value
 *
 * @returns
 * An object with the following properties:
 * - ``` `${capitalize(name)}Provider` ``` (e.g. `DirectionProvider`): the
 *   provider component
 * - ``` `use${capitalize(name)}` ``` (e.g. `useDirection`): a hook that returns
 *   the current context value if one was provided, or throws an error otherwise
 *
 * @see
 * {@linkcode CreateRequiredContext},
 * {@linkcode createGranularContext}
 *
 * @group Functions
 */
export const createRequiredContext: CreateRequiredContext = (<
  Name extends string,
  T,
  Props extends object,
>(
  ...args: [] | CreateRequiredContextWithCustomProviderArgs<Name, T, Props>
) => {
  let providerName: `${Capitalize<Name>}Provider`;

  function intermediate(
    name: Name,
  ): CreateRequiredContextWithStandardProviderResult<Name, T> {
    const capitalizedName = capitalize(name);
    providerName = `${capitalizedName}Provider` as const;
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
  }

  if (args.length === 0) return intermediate;

  const [name, providerHook] = args;

  const result = intermediate(name);
  const Provider = result[providerName!] as Provider<T>;

  return Object.assign(result, {
    [providerName!]: ((props: Props & { children?: ReactNode | undefined }) => {
      const value = providerHook(props);
      return <Provider value={value}>{props.children}</Provider>;
    }) satisfies FunctionComponent<
      Props & { children?: ReactNode | undefined }
    >,
  } as {
    [K in typeof providerName]: FunctionComponent<
      Props & { children?: ReactNode | undefined }
    >;
  }) satisfies CreateRequiredContextWithCustomProviderResult<Name, T, Props>;
}) as CreateRequiredContext;
