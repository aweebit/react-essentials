import { type FunctionComponent, type Provider, type ReactNode } from 'react';
import { capitalize } from '../utils.js';
import { contextualize } from './contextualize.js';
import { createRequiredContext } from './createRequiredContext.js';

/**
 * Generates multiple related contexts using {@linkcode createRequiredContext}
 * and returns hooks for each of them as well as a provider component for all
 * of them that incorporates user-defined logic for populating context values
 * supplied in the `providerHook` argument
 *
 * This function facilitates the application of the provider pattern in cases
 * where the provider component provides values for multiple related contexts.
 *
 * @example
 * ```tsx
 * const { SearchProvider, useSearchQuery, useSetSearchQuery } =
 *   createGranularContext(
 *     'Search',
 *     ['searchQuery', 'setSearchQuery'],
 *     ({ initialQuery }: { initialQuery?: string }) => {
 *       const [searchQuery, setSearchQuery] = useState(initialQuery ?? '');
 *       return { searchQuery, setSearchQuery };
 *     },
 *   );
 *
 * const App = () => (
 *   <SearchProvider>
 *     <Toolbar />
 *     <Data />
 *   </SearchProvider>
 * );
 *
 * // Won't re-render when query changes because it only uses the query setter 🥳
 * const Toolbar = () => {
 *   const setSearchQuery = useSetSearchQuery();
 *   return (
 *     <input onChange={(event) => setSearchQuery(event.currentTarget.value)} />
 *   );
 * };
 *
 * // Will re-render when query changes because it uses it 👍
 * const Data = () => {
 *   const searchQuery = useSearchQuery();
 *   // Fetch data and use searchQuery to filter it...
 * };
 * ```
 *
 * @param name
 * A string that the provider component's display name is derived from
 *
 * @param partNames
 * An array of strings from which the underlying contexts' display names are
 * derived from
 *
 * @param providerHook
 * A function that receives props passed to the provider component and is used
 * to populate the underlying contexts' values which it returns in an object
 * mapping names from `partNames` to their respective contexts' values
 *
 * @returns
 * An object with the following properties:
 * - ``` `${capitalize(name)}Provider` ``` (e.g. `SearchProvider`): the provider
 *   component
 * - ``` `use${capitalize(partName)}` ``` for each element `partName` of
 *   `partNames` (e.g. `useSearchQuery`, `useSetSearchQuery`): a hook that
 *   returns the current context value if one was provided, or throws an error
 *   otherwise
 *
 * @see
 * {@linkcode createRequiredContext}
 */
export function createGranularContext<
  Name extends string,
  const PartNames extends string[],
  Value extends Record<PartNames[number], unknown>,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Props extends object = {},
>(
  name: string extends Name ? never : Name,
  partNames: string extends PartNames[number] ? never : PartNames,
  providerHook: (props: Props) => Value,
): {
  [K in `${Capitalize<Name>}Provider`]: FunctionComponent<
    Props & { children?: ReactNode | undefined }
  >;
} & {
  [K in PartNames[number] as `use${Capitalize<K>}`]: () => Value[K];
} {
  const [providerMap, hooks] = partNames.reduce<
    [
      {
        [K in PartNames[number]]: Provider<Value[K]>;
      },
      {
        [K in PartNames[number] as `use${Capitalize<K>}`]: () => Value[K];
      },
    ]
  >(
    (result, partName: PartNames[number]) => {
      const capitalizedName = capitalize(partName);
      const providerName = `${capitalizedName}Provider` as const;
      const hookName = `use${capitalizedName}` as const;
      const context = createRequiredContext<unknown>()(capitalizedName);
      result[0][partName] = context[providerName] as never;
      result[1][hookName] = context[hookName] as never;
      return result;
    },
    [{} as never, {} as never],
  );

  const providerName = `${capitalize(name as Name)}Provider` as const;

  return Object.assign(
    {
      [providerName]: ((
        props: Props & { children?: ReactNode | undefined },
      ) => {
        const result = providerHook(props);
        return (
          Object.entries(providerMap) as Array<
            [PartNames[number], Provider<unknown>]
          >
        )
          .reduce(
            (pipe, [partName, provider]) =>
              pipe.with(provider, result[partName]),
            contextualize(props.children),
          )
          .end();
      }) satisfies FunctionComponent<
        Props & { children?: ReactNode | undefined }
      >,
    } as {
      [K in typeof providerName]: FunctionComponent<
        Props & { children?: ReactNode | undefined }
      >;
    },
    hooks,
  );
}
