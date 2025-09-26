# @aweebit/react-essentials

[![NPM Version](https://img.shields.io/npm/v/%40aweebit%2Freact-essentials)](https://www.npmjs.com/package/@aweebit/react-essentials)

### Requirements

- React ≥ 18
- TypeScript ≥ 5.4

### Functions

- [useEventListener()](#useeventlistener)
- [useReducerWithDeps()](#usereducerwithdeps)
- [useStateWithDeps()](#usestatewithdeps)
- [createSafeContext()](#createsafecontext)

### Types

- [UseEventListener](#useeventlistener-1)
- [UseEventListenerWithImplicitWindowTarget](#useeventlistenerwithimplicitwindowtarget)
- [UseEventListenerWithExplicitTarget](#useeventlistenerwithexplicittarget)
- [UseEventListenerWithAnyExplicitTarget](#useeventlistenerwithanyexplicittarget)
- [UseEventListenerWithImplicitWindowTargetArgs](#useeventlistenerwithimplicitwindowtargetargs)
- [UseEventListenerWithExplicitTargetArgs](#useeventlistenerwithexplicittargetargs)
- [RestrictedContext](#restrictedcontext)
- [SafeContext](#safecontext)

## useEventListener

```ts
const useEventListener: UseEventListener;
```

Defined in: [hooks/useEventListener.ts:135](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/hooks/useEventListener.ts#L135)

Adds `handler` as a listener for the event `eventName` of `target` with the
provided `options` applied

The following call signatures are available:

```ts
function useEventListener(eventName, handler, options?): void;
function useEventListener(target, eventName, handler, options?): void;
```

For the full definition of the hook's type, see [`UseEventListener`](#useeventlistener).

If `target` is not provided, `window` is used instead.

If `target` is `null`, no event listener is added. This is useful when
working with DOM element refs, or when the event listener needs to be removed
temporarily.

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

[`UseEventListener`](#useeventlistener)

---

## useReducerWithDeps()

```ts
function useReducerWithDeps<S, A>(
  reducer,
  initialState,
  deps,
): [S, ActionDispatch<A>];
```

Defined in: [hooks/useReducerWithDeps.ts:59](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/hooks/useReducerWithDeps.ts#L59)

`useReducer` hook with an additional dependency array `deps` that resets the
state to `initialState` when dependencies change

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

`S` \| (`previousState?`) => `S`

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

Defined in: [hooks/useStateWithDeps.ts:62](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/hooks/useStateWithDeps.ts#L62)

`useState` hook with an additional dependency array `deps` that resets the
state to `initialState` when dependencies change

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

`S` \| (`previousState?`) => `S`

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

## createSafeContext()

```ts
function createSafeContext<T>(): <DisplayName>(
  displayName,
) => SafeContext<DisplayName, T>;
```

Defined in: [misc/createSafeContext.ts:95](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/misc/createSafeContext.ts#L95)

For a given type `T`, returns a function that produces both a context of that
type and a hook that returns the current context value if one was provided,
or throws an error otherwise

The advantages over vanilla `createContext` are that no default value has to
be provided, and that a meaningful context name is displayed in dev tools
instead of generic `Context.Provider`.

### Example

```tsx
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// Before
const DirectionContext = createContext<Direction | undefined>(undefined);
DirectionContext.displayName = 'DirectionContext';

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

// After
const { DirectionContext, useDirection } =
  createSafeContext<Direction>()('Direction'); // That's it :)

const Parent = () => (
  // Providing undefined as the value is not allowed 👍
  <Direction.Provider value={Direction.Up}>
    <Child />
  </Direction.Provider>
);

const Child = () => `Current direction: ${Direction[useDirection()]}`;
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

`T`

</td>
<td>

`never`

</td>
</tr>
</tbody>
</table>

### Returns

A function that accepts a single string argument `displayName` (e.g.
`"Direction"`) and returns an object with the following properties:

- `` `${displayName}Context` `` (e.g. `DirectionContext`): the context
- `` `use${displayName}` `` (e.g. `useDirection`): a hook that returns the
  current context value if one was provided, or throws an error otherwise

```ts
<DisplayName>(displayName): SafeContext<DisplayName, T>;
```

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`DisplayName` _extends_ `string`

</td>
</tr>
</tbody>
</table>

#### Parameters

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

`displayName`

</td>
<td>

\[`T`\] _extends_ \[`never`\] ? `never` : `ArgumentFallback`\<`DisplayName`, `never`, `string`\>

</td>
</tr>
</tbody>
</table>

#### Returns

[`SafeContext`](#safecontext)\<`DisplayName`, `T`\>

### See

[`SafeContext`](#safecontext)

---

## UseEventListener

```ts
type UseEventListener = UseEventListenerWithImplicitWindowTarget &
  UseEventListenerWithExplicitGlobalTarget &
  UseEventListenerWithAnyExplicitTarget;
```

Defined in: [hooks/useEventListener.ts:12](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/hooks/useEventListener.ts#L12)

The type of [`useEventListener`](#useeventlistener-1)

### See

[`useEventListener`](#useeventlistener-1),
[`UseEventListenerWithImplicitWindowTarget`](#useeventlistenerwithimplicitwindowtarget),
[`UseEventListenerWithExplicitGlobalTarget`](#useeventlistenerwithexplicitglobaltarget),
[`UseEventListenerWithAnyExplicitTarget`](#useeventlistenerwithanyexplicittarget)

---

## UseEventListenerWithImplicitWindowTarget()

```ts
type UseEventListenerWithImplicitWindowTarget = <K>(...args) => void;
```

Defined in: [hooks/useEventListener.ts:21](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/hooks/useEventListener.ts#L21)

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

[`useEventListener`](#useeventlistener-1),
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

Defined in: [hooks/useEventListener.ts:32](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/hooks/useEventListener.ts#L32)

### See

[`useEventListener`](#useeventlistener-1),
[`UseEventListenerWithExplicitTarget`](#useeventlistenerwithexplicittarget)

---

## UseEventListenerWithExplicitTarget()

```ts
type UseEventListenerWithExplicitTarget<Target, EventMap> = <T, K>(
  ...args
) => void;
```

Defined in: [hooks/useEventListener.ts:44](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/hooks/useEventListener.ts#L44)

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

`Target` _extends_ `EventTarget`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`EventMap`

</td>
<td>

`Record`\<`string`, `Event`\>

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

[`useEventListener`](#useeventlistener-1),
[`UseEventListenerWithExplicitTargetArgs`](#useeventlistenerwithexplicittargetargs)

---

## UseEventListenerWithAnyExplicitTarget

```ts
type UseEventListenerWithAnyExplicitTarget =
  UseEventListenerWithExplicitTarget<EventTarget>;
```

Defined in: [hooks/useEventListener.ts:56](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/hooks/useEventListener.ts#L56)

### See

[`useEventListener`](#useeventlistener-1),
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

Defined in: [hooks/useEventListener.ts:64](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/hooks/useEventListener.ts#L64)

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

[`useEventListener`](#useeventlistener-1),
[`UseEventListenerWithExplicitTargetArgs`](#useeventlistenerwithexplicittargetargs)

---

## UseEventListenerWithExplicitTargetArgs

```ts
type UseEventListenerWithExplicitTargetArgs<EventMap, T, K> = [
  (
    | T
    | (RefObject<T> & {
        addEventListener?: never;
      })
    | null
  ),
  K,
  (this, event) => void,
  AddEventListenerOptions | boolean | undefined,
];
```

Defined in: [hooks/useEventListener.ts:78](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/hooks/useEventListener.ts#L78)

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

[`useEventListener`](#useeventlistener-1)

---

## RestrictedContext

```ts
type RestrictedContext<T> =
  Context<T> extends Provider<T>
    ? {
        Provider: Provider<T>;
        displayName: string;
      } & Provider<T>
    : {
        Provider: Provider<T>;
        displayName: string;
      };
```

Defined in: [misc/createSafeContext.ts:18](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/misc/createSafeContext.ts#L18)

A React context with a required `displayName` and the obsolete `Consumer`
property purposefully omitted so that it is impossible to pass the context
as an argument to `useContext` or `use` (the hook produced with
[`createSafeContext`](#createsafecontext) should be used instead)

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

### See

[`createSafeContext`](#createsafecontext)

---

## SafeContext

```ts
type SafeContext<DisplayName, T> = {
  [K in `${DisplayName}Context`]: RestrictedContext<T>;
} & { [K in `use${DisplayName}`]: () => T };
```

Defined in: [misc/createSafeContext.ts:30](https://github.com/aweebit/react-essentials/blob/v0.9.0/src/misc/createSafeContext.ts#L30)

The return type of [`createSafeContext`](#createsafecontext)

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

`DisplayName` _extends_ `string`

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

[`createSafeContext`](#createsafecontext),
[`RestrictedContext`](#restrictedcontext)
