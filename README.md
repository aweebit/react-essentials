

# @aweebit/react-essentials

[![NPM Version](https://img.shields.io/npm/v/%40aweebit%2Freact-essentials)](https://www.npmjs.com/package/@aweebit/react-essentials)

- [useEventListener()](#useeventlistener)
- [useIsomorphicLayoutEffect()](#useisomorphiclayouteffect)
- [useReducerWithDeps()](#usereducerwithdeps)
- [useStateWithDeps()](#usestatewithdeps)
- [contextualize()](#contextualize)
- [createGranularContext()](#creategranularcontext)
- [createRequiredContext()](#createrequiredcontext)
- [wrapJSX()](#wrapjsx)

### Requirements

- React ≥ 18
- TypeScript ≥ 5.4

## useEventListener

```ts
const useEventListener: UseEventListener;
```

Defined in: [hooks/useEventListener.ts:154](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useEventListener.ts#L154)

Adds `handler` as a listener for the event `eventName` of `target` with the
provided `options` applied

The following call signatures are available:

```ts
function useEventListener(eventName, handler, options?): void;
function useEventListener(target, eventName, handler, options?): void;
```

For the full definition of the hook's type, see [`UseEventListener`](#useeventlistener-1).

If `target` is not provided, `window` is used instead.

If `target` is `null` or `undefined`, no event listener is added. This can be
used to add an event listener conditionally.

`target` can also be a ref object created with [`useRef`](https://react.dev/reference/react/useRef). Beware
that in that case, changes to the ref's `current` value are only detected
correctly if a re-render happens at the same time it is changed. In other
words, it is required that whenever the ref's `current` value is updated,
some state in the component using the hook also changes at the same time.

You should never use a ref's `current` value as `target` directly as that
violates the rule of React that forbids reading refs during rendering (see
[the `refs` rule](https://react.dev/reference/eslint-plugin-react-hooks/lints/refs)
of `eslint-plugin-react-hooks` for details).

### Example

```tsx
useEventListener('resize', () => {
  console.log(window.innerWidth, window.innerHeight);
});

useEventListener(document, 'visibilitychange', () => {
  console.log(document.visibilityState);
});

const buttonRef = useRef<HTMLButtonElement>(null);
useEventListener(buttonRef, 'click', () => console.log('click'));
```

### See

[`UseEventListener`](#useeventlistener-1)

---

## useIsomorphicLayoutEffect

```ts
const useIsomorphicLayoutEffect: (effect, deps?) => void;
```

Defined in: [hooks/useIsomorphicLayoutEffect.ts:14](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useIsomorphicLayoutEffect.ts#L14)

Identical to [`useLayoutEffect`](https://react.dev/reference/react/useLayoutEffect) on the client, but falls back to [`useEffect`](https://react.dev/reference/react/useEffect) on the server to avoid hydration warnings.

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`effect`

</td>
<td>

`EffectCallback`

</td>
</tr>
<tr>
<td>

`deps?`

</td>
<td>

`DependencyList`

</td>
</tr>
</tbody>
</table>

### Returns

`void`

---

## useReducerWithDeps()

```ts
function useReducerWithDeps<S, A>(
  reducer,
  initialState,
  deps,
): [S, ActionDispatch<A>];
```

Defined in: [hooks/useReducerWithDeps.ts:64](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useReducerWithDeps.ts#L64)

[`useReducer`](https://react.dev/reference/react/useReducer) hook with an additional dependency array `deps` that
resets the state to `initialState` when dependencies change

This hook is the reducer pattern counterpart of [`useStateWithDeps`](#usestatewithdeps).

Due to React's limitations, a change in dependencies always causes two
renders when using this hook. The result of the first render is thrown away
as described in
[useState > Storing information from previous renders](https://react.dev/reference/react/useState#storing-information-from-previous-renders).

For motivation and examples, see
https://github.com/facebook/react/issues/33041.

### On linter support

The `react-hooks/exhaustive-deps` ESLint rule doesn't support hooks where
the dependency array parameter is at any other position than the second.
However, as we would like to keep the hook as compatible with `useReducer` as
possible, we don't want to artificially change the parameter's position.
Therefore, there will be no warnings about missing dependencies.
Because of that, additional caution is advised!
Be sure to check that no dependencies are missing from the `deps` array.

Related issue: [https://github.com/facebook/react/issues/25443](https://github.com/facebook/react/issues/25443).

Unlike `eslint-plugin-react-hooks` maintained by React's team, the unofficial
`useExhaustiveDependencies` rule provided for Biome by Biome's team
does actually have support for dependency arrays at other positions, see
[useExhaustiveDependencies \> Options \> Validating dependencies](https://biomejs.dev/linter/rules/use-exhaustive-dependencies/#validating-dependencies).

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`S`

</td>
</tr>
<tr>
<td>

`A` _extends_ `AnyActionArg`

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`reducer`

</td>
<td>

(`prevState`, ...`args`) => `S`

</td>
<td>

The reducer function that specifies how the state gets updated

</td>
</tr>
<tr>
<td>

`initialState`

</td>
<td>

`S` \| ((`previousState?`) => `S`)

</td>
<td>

The value to which the state is set when the component is
mounted or dependencies change

It can also be a function that returns a state value. If the state is reset
due to a change of dependencies, this function will be passed the previous
state as its argument (will be `undefined` in the first call upon mount).

</td>
</tr>
<tr>
<td>

`deps`

</td>
<td>

`DependencyList`

</td>
<td>

Dependencies that reset the state to `initialState`

</td>
</tr>
</tbody>
</table>

### Returns

\[`S`, `ActionDispatch`\<`A`\>\]

---

## useStateWithDeps()

```ts
function useStateWithDeps<S>(
  initialState,
  deps,
): [S, Dispatch<SetStateAction<S>>];
```

Defined in: [hooks/useStateWithDeps.ts:62](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useStateWithDeps.ts#L62)

[`useState`](https://react.dev/reference/react/useState) hook with an additional dependency array `deps` that
resets the state to `initialState` when dependencies change

Due to React's limitations, a change in dependencies always causes two
renders when using this hook. The result of the first render is thrown away
as described in
[useState > Storing information from previous renders](https://react.dev/reference/react/useState#storing-information-from-previous-renders).

For motivation and more examples, see
https://github.com/facebook/react/issues/33041.

### Example

```tsx
type Activity = 'breakfast' | 'exercise' | 'swim' | 'board games' | 'dinner';

const timeOfDayOptions = ['morning', 'afternoon', 'evening'] as const;
type TimeOfDay = (typeof timeOfDayOptions)[number];

const activityOptionsByTimeOfDay: {
  [K in TimeOfDay]: [Activity, ...Activity[]];
} = {
  morning: ['breakfast', 'exercise', 'swim'],
  afternoon: ['exercise', 'swim', 'board games'],
  evening: ['board games', 'dinner'],
};

function Example() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');

  const activityOptions = activityOptionsByTimeOfDay[timeOfDay];
  const [activity, setActivity] = useStateWithDeps<Activity>(
    (prev) => {
      // Make sure activity is always valid for the current timeOfDay value,
      // but also don't reset it unless necessary:
      return prev && activityOptions.includes(prev) ? prev : activityOptions[0];
    },
    [activityOptions],
  );

  return '...';
}
```

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`S`

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`initialState`

</td>
<td>

`S` \| ((`previousState?`) => `S`)

</td>
<td>

The value to which the state is set when the component is
mounted or dependencies change

It can also be a function that returns a state value. If the state is reset
due to a change of dependencies, this function will be passed the previous
state as its argument (will be `undefined` in the first call upon mount).

</td>
</tr>
<tr>
<td>

`deps`

</td>
<td>

`DependencyList`

</td>
<td>

Dependencies that reset the state to `initialState`

</td>
</tr>
</tbody>
</table>

### Returns

\[`S`, `Dispatch`\<`SetStateAction`\<`S`\>\>\]

---

## contextualize()

```ts
function contextualize<Children>(children): ContextualizePipe<Children>;
```

Defined in: [misc/contextualize.tsx:68](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/contextualize.tsx#L68)

An alternative way to provide context values to component trees that avoids
ever-increasing indentation

A context-specific version of the more general [`wrapJSX`](#wrapjsx) function.

### Example

```tsx
// Before:
return (
  <CourseIdContext.Provider value={courseId}>
    <DeckIdContext.Provider value={deckId}>
      <FlashcardsContext.Provider value={flashcards}>
        <EventHandlersContext.Provider value={eventHandlers}>
          {children}
        </EventHandlersContext.Provider>
      </FlashcardsContext.Provider>
    </DeckIdContext.Provider>
  </CourseIdContext.Provider>
);

// After:
return contextualize(children)
  .with(EventHandlersContext, eventHandlers)
  .with(FlashcardsContext, flashcards)
  .with(DeckIdContext, deckId)
  .with(CourseIdContext, courseId)
  .end();
```

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Children` _extends_ `ReactNode`

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`children`

</td>
<td>

`Children`

</td>
<td>

The children to contextualize

</td>
</tr>
</tbody>
</table>

### Returns

[`ContextualizePipe`](#contextualizepipe)\<`Children`\>

An object with the following properties:

- `with`: a function that accepts a context provider `Provider` (or the
  context it belongs to) and a value `value` for that context as arguments
  and returns `contextualize(<Provider value={value}>{children}</Provider>)`
- `end`: a function that returns `children`

### See

[`ContextualizePipe`](#contextualizepipe)

---

## createGranularContext()

```ts
function createGranularContext<Name, PartNames, Value, Props>(
  name,
  partNames,
  providerHook,
): CreateRequiredContextWithCustomProviderResultProviderPart<Name, Props> & {
  [K in string as `use${Capitalize<K>}`]: () => Value[K];
};
```

Defined in: [misc/createGranularContext.tsx:76](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/createGranularContext.tsx#L76)

Generates multiple related contexts using [`createRequiredContext`](#createrequiredcontext)
and returns hooks for each of them as well as a provider component for all
of them that incorporates user-defined logic for populating context values
supplied in the `providerHook` argument

This function facilitates the application of the provider pattern in cases
where the provider component provides values for multiple related contexts.

### Example

```tsx
const { SearchProvider, useSearchQuery, useSetSearchQuery } =
  createGranularContext(
    'Search',
    ['searchQuery', 'setSearchQuery'],
    ({ initialQuery }: { initialQuery?: string }) => {
      const [searchQuery, setSearchQuery] = useState(initialQuery ?? '');
      return { searchQuery, setSearchQuery };
    },
  );

const App = () => (
  <SearchProvider>
    <Toolbar />
    <Data />
  </SearchProvider>
);

// Won't re-render when query changes because it only uses the query setter 🥳
const Toolbar = () => {
  const setSearchQuery = useSetSearchQuery();
  return (
    <input onChange={(event) => setSearchQuery(event.currentTarget.value)} />
  );
};

// Will re-render when query changes because it uses it 👍
const Data = () => {
  const searchQuery = useSearchQuery();
  // Fetch data and use searchQuery to filter it...
};
```

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Default type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Name` _extends_ `string`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`PartNames` _extends_ `string`[]

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`Value` _extends_ `Record`\<`PartNames`\[`number`\], `unknown`\>

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`Props` _extends_ `object`

</td>
<td>

\{
\}

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`name`

</td>
<td>

`string` _extends_ `Name` ? `never` : `Name`

</td>
<td>

A string that the provider component's display name is derived from

</td>
</tr>
<tr>
<td>

`partNames`

</td>
<td>

`string` _extends_ `PartNames`\[`number`\] ? `never` : `PartNames`

</td>
<td>

An array of strings the underlying contexts' display names are derived from

</td>
</tr>
<tr>
<td>

`providerHook`

</td>
<td>

(`props`) => `Value`

</td>
<td>

A function that receives props passed to the provider component as its
argument and is used to populate the underlying contexts whose current values
it should return in an object mapping names from `partNames` to their
respective contexts' values

</td>
</tr>
</tbody>
</table>

### Returns

[`CreateRequiredContextWithCustomProviderResultProviderPart`](#createrequiredcontextwithcustomproviderresultproviderpart)\<`Name`, `Props`\> & ``{ [K in string as `use${Capitalize<K>}`]: () => Value[K] }``

An object with the following properties:

- `` `${capitalize(name)}Provider` `` (e.g. `SearchProvider`): the provider
  component
- `` `use${capitalize(partName)}` `` for each element `partName` of
  `partNames` (e.g. `useSearchQuery`, `useSetSearchQuery`): a hook that
  returns the current context value if one was provided, or throws an error
  otherwise

### See

[`createRequiredContext`](#createrequiredcontext),
[`CreateRequiredContextWithCustomProviderResultProviderPart`](#createrequiredcontextwithcustomproviderresultproviderpart)

---

## createRequiredContext

```ts
const createRequiredContext: CreateRequiredContext;
```

Defined in: [misc/createRequiredContext.tsx:230](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/createRequiredContext.tsx#L230)

Generates a context of type `T` and returns both a provider component and a
hook for that context where the hook will throw an error if no context value
has been provided

The advantages over vanilla [`createContext`](https://react.dev/reference/react/createContext) are that no default
value has to be specified, and that a meaningful context name is displayed in
dev tools instead of a generic `Context.Provider`.

The following call patterns are available:

```ts
createRequiredContext<T>()(name);
createRequiredContext(name, providerHook);
```

When the first one is used, the standard React context provider is returned.
The type `T` has to be specified explicitly. Two calls are necessary due to
TypeScript's limitations.

The second pattern can be used when it is desired that the provider component
incorporates custom reactive logic for context value derivation. The type `T`
is inferred as the return type of `providerHook` which is the function where
that custom logic resides.

For the full definition of the function's type, see
[`CreateRequiredContext`](#createrequiredcontext-1).

When multiple related values are provided by a single provider component, it
is important that values that update independently from one another are kept
in separate contexts because otherwise, unnecessary re-renders are likely to
happen. For example, a reactive value and its respective setter function
should be put in separate contexts because the former can change, while the
latter never changes. To generate contexts like that, please use
[`createGranularContext`](#creategranularcontext).

### Example

```tsx
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// Before:
const DirectionContext = createContext<Direction | undefined>(undefined);
DirectionContext.displayName = 'DirectionContext';

const DirectionProvider = DirectionContext.Provider;
const useDirection = () => {
  const direction = useContext(DirectionContext);
  if (direction === undefined) {
    // Called outside of a <DirectionContext.Provider> boundary!
    // Or maybe undefined was explicitly provided as the context value
    // (ideally that shouldn't be allowed, but it is because we had to include
    // undefined in the context type so as to provide a meaningful default)
    throw new Error('No DirectionContext value was provided');
  }
  // Thanks to the undefined check, the type is now narrowed down to Direction
  return direction;
};

// After:
const { DirectionProvider, useDirection } =
  createRequiredContext<Direction>()('Direction'); // That's it :)

const Parent = () => (
  // Providing undefined as the value is not allowed 👍
  <DirectionProvider value={Direction.Up}>
    <Child />
  </DirectionProvider>
);

const Child = () => `Provided direction: ${Direction[useDirection()]}`;

// Custom provider example:
const { TimeProvider, useTime } = createRequiredContext(
  'Time',
  ({ startTime = 0 }: { startTime?: number }) => {
    const [time, setTime] = useState(startTime);
    useEffect(() => {
      const interval = setInterval(() => setTime((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }, []);
    return time;
  },
);

const Parent = () => (
  <TimeProvider startTime={-30}>
    <Child />
  </TimeProvider>
);

const Child = () => `Time: ${useTime()}`;
```

### Param

**name**

A string the context's display name is derived from

### Param

**providerHook**

An optional custom provider hook that receives props passed to the provider
component as its argument and should return the context's current value

### Returns

An object with the following properties:

- `` `${capitalize(name)}Provider` `` (e.g. `DirectionProvider`): the
  provider component
- `` `use${capitalize(name)}` `` (e.g. `useDirection`): a hook that returns
  the current context value if one was provided, or throws an error otherwise

### See

[`CreateRequiredContext`](#createrequiredcontext-1),
[`createGranularContext`](#creategranularcontext)

---

## wrapJSX()

```ts
function wrapJSX<Children>(children): JSXWrapPipe<Children>;
```

Defined in: [misc/wrapJSX.tsx:98](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/wrapJSX.tsx#L98)

An alternative way to compose JSX that avoids ever-increasing indentation

A more general version of the context-specific [`contextualize`](#contextualize)
function.

### Example

```tsx
// Before:
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <ThemeProvider theme={theme}>
            <ToasterProvider>
              <App />
            </ToasterProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </I18nextProvider>
  </StrictMode>,
);

// After:
createRoot(document.getElementById('root')!).render(
  wrapJSX(<App />)
    .with(ToasterProvider)
    .with(ThemeProvider, { theme })
    .with(NuqsAdapter)
    .with(QueryClientProvider, { client: queryClient })
    .with(I18nextProvider, { i18n })
    .with(StrictMode)
    .end(),
);
```

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Children` _extends_ `ReactNode`

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`children`

</td>
<td>

`Children`

</td>
<td>

The children to wrap

</td>
</tr>
</tbody>
</table>

### Returns

[`JSXWrapPipe`](#jsxwrappipe)\<`Children`\>

An object with the following properties:

- `with`: a function that accepts a component `Component` and props `props`
  for it as arguments and returns
  `wrapJSX(<Component {...props}>{children}</Component>)`
- `end`: a function that returns `children`

### See

[`JSXWrapPipe`](#jsxwrappipe)

---

## UseEventListener

```ts
type UseEventListener = UseEventListenerWithImplicitWindowTarget &
  UseEventListenerWithExplicitGlobalTarget &
  UseEventListenerWithAnyExplicitTarget;
```

Defined in: [hooks/useEventListener.ts:13](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useEventListener.ts#L13)

The type of [`useEventListener`](#useeventlistener)

### See

[`useEventListener`](#useeventlistener),
[`UseEventListenerWithImplicitWindowTarget`](#useeventlistenerwithimplicitwindowtarget),
[`UseEventListenerWithExplicitGlobalTarget`](#useeventlistenerwithexplicitglobaltarget),
[`UseEventListenerWithAnyExplicitTarget`](#useeventlistenerwithanyexplicittarget)

---

## UseEventListenerWithImplicitWindowTarget

```ts
type UseEventListenerWithImplicitWindowTarget = <K>(...args) => void;
```

Defined in: [hooks/useEventListener.ts:22](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useEventListener.ts#L22)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`K` _extends_ keyof `WindowEventMap`

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

...`args`

</td>
<td>

[`UseEventListenerWithImplicitWindowTargetArgs`](#useeventlistenerwithimplicitwindowtargetargs)\<`K`\>

</td>
</tr>
</tbody>
</table>

### Returns

`void`

### See

[`useEventListener`](#useeventlistener),
[`UseEventListenerWithImplicitWindowTargetArgs`](#useeventlistenerwithimplicitwindowtargetargs)

---

## UseEventListenerWithExplicitGlobalTarget

```ts
type UseEventListenerWithExplicitGlobalTarget =
  UseEventListenerWithExplicitTarget<Window, WindowEventMap> &
    UseEventListenerWithExplicitTarget<Document, DocumentEventMap> &
    UseEventListenerWithExplicitTarget<HTMLElement, HTMLElementEventMap> &
    UseEventListenerWithExplicitTarget<SVGElement, SVGElementEventMap> &
    UseEventListenerWithExplicitTarget<MathMLElement, MathMLElementEventMap>;
```

Defined in: [hooks/useEventListener.ts:33](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useEventListener.ts#L33)

### See

[`useEventListener`](#useeventlistener),
[`UseEventListenerWithExplicitTarget`](#useeventlistenerwithexplicittarget)

---

## UseEventListenerWithExplicitTarget

```ts
type UseEventListenerWithExplicitTarget<Target, EventMap> = <T, K>(
  ...args
) => void;
```

Defined in: [hooks/useEventListener.ts:45](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useEventListener.ts#L45)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Target` _extends_ `EventTarget`

</td>
</tr>
<tr>
<td>

`EventMap`

</td>
</tr>
</tbody>
</table>

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` _extends_ `Target`

</td>
</tr>
<tr>
<td>

`K` _extends_ keyof `EventMap`

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

...`args`

</td>
<td>

[`UseEventListenerWithExplicitTargetArgs`](#useeventlistenerwithexplicittargetargs)\<`EventMap`, `T`, `K`\>

</td>
</tr>
</tbody>
</table>

### Returns

`void`

### See

[`useEventListener`](#useeventlistener),
[`UseEventListenerWithExplicitTargetArgs`](#useeventlistenerwithexplicittargetargs)

---

## UseEventListenerWithAnyExplicitTarget

```ts
type UseEventListenerWithAnyExplicitTarget = UseEventListenerWithExplicitTarget<
  EventTarget,
  Record<string, Event>
>;
```

Defined in: [hooks/useEventListener.ts:57](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useEventListener.ts#L57)

### See

[`useEventListener`](#useeventlistener),
[`UseEventListenerWithExplicitTarget`](#useeventlistenerwithexplicittarget)

---

## UseEventListenerWithImplicitWindowTargetArgs

```ts
type UseEventListenerWithImplicitWindowTargetArgs<K> =
  UseEventListenerWithExplicitTargetArgs<WindowEventMap, Window, K> extends [
    unknown,
    ...infer Args,
  ]
    ? Args
    : never;
```

Defined in: [hooks/useEventListener.ts:65](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useEventListener.ts#L65)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`K` _extends_ keyof `WindowEventMap`

</td>
</tr>
</tbody>
</table>

### See

[`useEventListener`](#useeventlistener),
[`UseEventListenerWithExplicitTargetArgs`](#useeventlistenerwithexplicittargetargs)

---

## UseEventListenerWithExplicitTargetArgs

```ts
type UseEventListenerWithExplicitTargetArgs<EventMap, T, K> = [
  (
    | T
    | (RefObject<T | null | undefined> & {
        addEventListener?: never;
      })
    | null
    | undefined
  ),
  K,
  (this, event) => void,
  AddEventListenerOptions | boolean | undefined,
];
```

Defined in: [hooks/useEventListener.ts:79](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/hooks/useEventListener.ts#L79)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`EventMap`

</td>
</tr>
<tr>
<td>

`T` _extends_ `EventTarget`

</td>
</tr>
<tr>
<td>

`K` _extends_ keyof `EventMap`

</td>
</tr>
</tbody>
</table>

### See

[`useEventListener`](#useeventlistener)

---

## ContextualizePipe

```ts
type ContextualizePipe<Children> = {
  with: ContextualizeWith;
  end: () => Children;
};
```

Defined in: [misc/contextualize.tsx:12](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/contextualize.tsx#L12)

The return type of [`contextualize`](#contextualize)

### See

[`contextualize`](#contextualize),
[`ContextualizeWith`](#contextualizewith)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Children` _extends_ `ReactNode`

</td>
</tr>
</tbody>
</table>

### Properties

<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="property-with"></a> `with`

</td>
<td>

[`ContextualizeWith`](#contextualizewith)

</td>
</tr>
<tr>
<td>

<a id="property-end"></a> `end`

</td>
<td>

() => `Children`

</td>
</tr>
</tbody>
</table>

---

## ContextualizeWith

```ts
type ContextualizeWith = <T>(
  Provider,
  value,
) => ContextualizePipe<ReactElement>;
```

Defined in: [misc/contextualize.tsx:22](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/contextualize.tsx#L22)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T`

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Provider`

</td>
<td>

`Provider`\<`T`\> \| `Context`\<`T`\>

</td>
</tr>
<tr>
<td>

`value`

</td>
<td>

`NoInfer`\<`T`\>

</td>
</tr>
</tbody>
</table>

### Returns

[`ContextualizePipe`](#contextualizepipe)\<`ReactElement`\>

### See

[`contextualize`](#contextualize),
[`ContextualizePipe`](#contextualizepipe)

---

## CreateRequiredContext

```ts
type CreateRequiredContext = CreateRequiredContextWithStandardProvider &
  CreateRequiredContextWithCustomProvider;
```

Defined in: [misc/createRequiredContext.tsx:24](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/createRequiredContext.tsx#L24)

The type of [`createRequiredContext`](#createrequiredcontext)

### See

[`createRequiredContext`](#createrequiredcontext),
[`CreateRequiredContextWithStandardProvider`](#createrequiredcontextwithstandardprovider),
[`CreateRequiredContextWithCustomProvider`](#createrequiredcontextwithcustomprovider)

---

## CreateRequiredContextResultHookPart

```ts
type CreateRequiredContextResultHookPart<Name, T> = {
  [K in `use${Capitalize<Name>}`]: () => T;
};
```

Defined in: [misc/createRequiredContext.tsx:31](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/createRequiredContext.tsx#L31)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Name` _extends_ `string`

</td>
</tr>
<tr>
<td>

`T`

</td>
</tr>
</tbody>
</table>

### See

[`createRequiredContext`](#createrequiredcontext)

---

## CreateRequiredContextWithStandardProvider

```ts
type CreateRequiredContextWithStandardProvider = <T>() => <Name>(
  name,
) => CreateRequiredContextWithStandardProviderResult<Name, T>;
```

Defined in: [misc/createRequiredContext.tsx:40](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/createRequiredContext.tsx#L40)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Default type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T`

</td>
<td>

`never`

</td>
</tr>
</tbody>
</table>

### Returns

\<`Name`\>(`name`) => [`CreateRequiredContextWithStandardProviderResult`](#createrequiredcontextwithstandardproviderresult)\<`Name`, `T`\>

### See

[`createRequiredContext`](#createrequiredcontext),
[`CreateRequiredContextWithStandardProviderResult`](#createrequiredcontextwithstandardproviderresult)

---

## CreateRequiredContextWithStandardProviderResult

```ts
type CreateRequiredContextWithStandardProviderResult<Name, T> = {
  [K in `${Capitalize<Name>}Provider`]: Provider<T>;
} & CreateRequiredContextResultHookPart<Name, T>;
```

Defined in: [misc/createRequiredContext.tsx:51](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/createRequiredContext.tsx#L51)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Name` _extends_ `string`

</td>
</tr>
<tr>
<td>

`T`

</td>
</tr>
</tbody>
</table>

### See

[`createRequiredContext`](#createrequiredcontext),
[`CreateRequiredContextResultHookPart`](#createrequiredcontextresulthookpart)

---

## CreateRequiredContextWithCustomProvider

```ts
type CreateRequiredContextWithCustomProvider = <Name, T, Props>(
  ...args
) => CreateRequiredContextWithCustomProviderResult<Name, T, Props>;
```

Defined in: [misc/createRequiredContext.tsx:64](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/createRequiredContext.tsx#L64)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Default type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Name` _extends_ `string`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`T`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`Props` _extends_ `object`

</td>
<td>

\{
\}

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

...`args`

</td>
<td>

[`CreateRequiredContextWithCustomProviderArgs`](#createrequiredcontextwithcustomproviderargs)\<`Name`, `T`, `Props`\>

</td>
</tr>
</tbody>
</table>

### Returns

[`CreateRequiredContextWithCustomProviderResult`](#createrequiredcontextwithcustomproviderresult)\<`Name`, `T`, `Props`\>

### See

[`createRequiredContext`](#createrequiredcontext),
[`CreateRequiredContextWithCustomProviderArgs`](#createrequiredcontextwithcustomproviderargs),
[`CreateRequiredContextWithCustomProviderResult`](#createrequiredcontextwithcustomproviderresult)

---

## CreateRequiredContextWithCustomProviderArgs

```ts
type CreateRequiredContextWithCustomProviderArgs<Name, T, Props> = [
  string extends Name ? never : Name,
  (props) => T,
];
```

Defined in: [misc/createRequiredContext.tsx:77](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/createRequiredContext.tsx#L77)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Name` _extends_ `string`

</td>
</tr>
<tr>
<td>

`T`

</td>
</tr>
<tr>
<td>

`Props` _extends_ `object`

</td>
</tr>
</tbody>
</table>

### See

[`createRequiredContext`](#createrequiredcontext)

---

## CreateRequiredContextWithCustomProviderResult

```ts
type CreateRequiredContextWithCustomProviderResult<Name, T, Props> =
  CreateRequiredContextWithCustomProviderResultProviderPart<Name, Props> &
    CreateRequiredContextResultHookPart<Name, T>;
```

Defined in: [misc/createRequiredContext.tsx:92](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/createRequiredContext.tsx#L92)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Name` _extends_ `string`

</td>
</tr>
<tr>
<td>

`T`

</td>
</tr>
<tr>
<td>

`Props` _extends_ `object`

</td>
</tr>
</tbody>
</table>

### See

[`createRequiredContext`](#createrequiredcontext),
[`CreateRequiredContextWithCustomProviderResultProviderPart`](#createrequiredcontextwithcustomproviderresultproviderpart),
[`CreateRequiredContextResultHookPart`](#createrequiredcontextresulthookpart)

---

## CreateRequiredContextWithCustomProviderResultProviderPart

```ts
type CreateRequiredContextWithCustomProviderResultProviderPart<Name, Props> = {
  [K in `${Capitalize<Name>}Provider`]: FunctionComponent<
    Props & { children?: ReactNode }
  >;
};
```

Defined in: [misc/createRequiredContext.tsx:103](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/createRequiredContext.tsx#L103)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Name` _extends_ `string`

</td>
</tr>
<tr>
<td>

`Props` _extends_ `object`

</td>
</tr>
</tbody>
</table>

### See

[`createRequiredContext`](#createrequiredcontext)

---

## JSXWrapPipe

```ts
type JSXWrapPipe<Children> = {
  with: WrapJSXWith<Children>;
  end: () => Children;
};
```

Defined in: [misc/wrapJSX.tsx:18](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/wrapJSX.tsx#L18)

The return type of [`wrapJSX`](#wrapjsx)

### See

[`wrapJSX`](#wrapjsx),
[`WrapJSXWith`](#wrapjsxwith)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Children` _extends_ `ReactNode`

</td>
</tr>
</tbody>
</table>

### Properties

<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="property-with-1"></a> `with`

</td>
<td>

[`WrapJSXWith`](#wrapjsxwith)\<`Children`\>

</td>
</tr>
<tr>
<td>

<a id="property-end-1"></a> `end`

</td>
<td>

() => `Children`

</td>
</tr>
</tbody>
</table>

---

## WrapJSXWith

```ts
type WrapJSXWith<Children> = <C>(...args) => JSXWrapPipe<ReactElement>;
```

Defined in: [misc/wrapJSX.tsx:28](https://github.com/aweebit/react-essentials/blob/v0.12.3/src/misc/wrapJSX.tsx#L28)

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`Children` _extends_ `ReactNode`

</td>
</tr>
</tbody>
</table>

### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`C` _extends_ keyof `JSX.IntrinsicElements` \| `JSXElementConstructor`\<`any`\>

</td>
</tr>
</tbody>
</table>

### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

...`args`

</td>
<td>

\[`"children"` _extends_ keyof `ComponentProps`\<`C`\> ? \[`Children`\] _extends_ \[`ComponentProps`\<`C`\>\[`"children"`\]\] ? `C` : `never` : `never`, `...(Record<never, unknown> extends Omit<ComponentProps<C>, "children"> ? [props?: JSX.IntrinsicAttributes & Omit<ComponentProps<C>, "children">] : [props: JSX.IntrinsicAttributes & Omit<ComponentProps<C>, "children">])`\]

</td>
</tr>
</tbody>
</table>

### Returns

[`JSXWrapPipe`](#jsxwrappipe)\<`ReactElement`\>

### See

[`wrapJSX`](#wrapjsx),
[`JSXWrapPipe`](#jsxwrappipe)
