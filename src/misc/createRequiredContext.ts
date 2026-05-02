import { createContext, type Provider, useContext } from 'react';

const moContextValueSymbol = Symbol(
  '@aweebit/react-essentials/no-context-value',
);

/**
 * For a given type `T`, returns a function that generates a context of that
 * type, and returns both a provider component and a hook for that context where
 * the hook will throw if no context value has been provided
 *
 * The advantages over vanilla `createContext` are that no default value has to
 * be specified, and that a meaningful context name is displayed in dev tools
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
 * // Intended usage with dynamic context values:
 * const { DispatchProvider, useDispatch } = createRequiredContext<{
 *   setDirection: (direction: Direction) => void;
 * }>()('Dispatch');
 *
 * const GameContextProvider = ({
 *   initialDirection,
 *   children,
 * }: {
 *   initialDirection: Direction;
 *   children: React.ReactNode;
 * }) => {
 *   const [direction, setDirection] = useStateWithDeps(initialDirection, [
 *     initialDirection,
 *   ]);
 *
 *   return contextualize(children)
 *     .with(DispatchProvider, { setDirection })
 *     .with(DirectionProvider, direction)
 *     .end();
 * };
 *
 * const Game = () => {
 *   return wrapJSX(<DirectChild />)
 *     .with(GameContextProvider, { initialDirection: Direction.Up })
 *     .end();
 * };
 *
 * const keyDirectionMapping = {
 *   KeyW: Direction.Up,
 *   KeyA: Direction.Left,
 *   KeyS: Direction.Down,
 *   KeyD: Direction.Right,
 * } as const;
 *
 * // Won't re-render when direction changes because it only uses dispatch 🥳
 * const DirectChild = () => {
 *   const { setDirection } = useDispatch();
 *
 *   useEventListener('keydown', (event) => {
 *     if (event.code in keyDirectionMapping) {
 *       setDirection(
 *         keyDirectionMapping[event.code as keyof typeof keyDirectionMapping],
 *       );
 *     }
 *   });
 *
 *   return <IndirectChild />;
 * };
 *
 * // Will re-render when direction changes because it uses it 👍
 * const IndirectChild = () => `Current direction: ${Direction[useDirection()]}`;
 * ```
 *
 * @returns
 * A function that accepts a single string argument `displayName` (e.g.
 * `"Direction"`) and returns an object with the following properties:
 * - ``` `${displayName}Provider` ``` (e.g. `DirectionProvider`): the context
 *   provider
 * - ``` `use${displayName}` ``` (e.g. `useDirection`): a hook that returns the
 *   current context value if one was provided, or throws an error otherwise
 */
export function createRequiredContext<T = never>() {
  return <DisplayName extends string>(
    displayName: [T] extends [never]
      ? never
      : string extends DisplayName
        ? never
        : DisplayName,
  ): {
    [K in `${DisplayName}Provider`]: Provider<T>;
  } & {
    [K in `use${DisplayName}`]: () => T;
  } => {
    const providerName = `${displayName as DisplayName}Provider` as const;
    const hookName = `use${displayName as DisplayName}` as const;

    const Context = createContext<T | typeof moContextValueSymbol>(
      moContextValueSymbol,
    );
    Context.displayName = `${displayName}Context`;

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
