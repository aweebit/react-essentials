# @aweebit/react-essentials

## RestrictedContext

```ts
type RestrictedContext<T> = Provider<T> & {
  Provider: Provider<T>;
  displayName: string;
};
```

Defined in: [misc/createSafeContext.ts:12](https://github.com/aweebit/react-essentials/blob/v0.6.0/src/misc/createSafeContext.ts#L12)

A React context with a required `displayName` and the obsolete `Consumer`
property purposefully omitted so that it is impossible to pass the context
as an argument to `useContext` or `use` (the hook produced with
[`createSafeContext`](#createsafecontext) should be used instead)

### Type Declaration

| Name          | Type              |
| ------------- | ----------------- |
| `Provider`    | `Provider`\<`T`\> |
| `displayName` | `string`          |

### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

### See

[`createSafeContext`](#createsafecontext)

---

## SafeContext

```ts
type SafeContext<DisplayName, T> =
  ArgumentFallback<DisplayName, never, string> extends never
    ? never
    : { [K in `${DisplayName}Context`]: RestrictedContext<T> } & {
        [K in `use${DisplayName}`]: () => T;
      };
```

Defined in: [misc/createSafeContext.ts:20](https://github.com/aweebit/react-essentials/blob/v0.6.0/src/misc/createSafeContext.ts#L20)

### Type Parameters

| Type Parameter                   |
| -------------------------------- |
| `DisplayName` _extends_ `string` |
| `T`                              |

### See

[`createSafeContext`](#createsafecontext)

---

## useEventListener()

```ts
function useEventListener<T>(eventName, handler, element?, options?): void;
```

Defined in: [hooks/useEventListener.ts:120](https://github.com/aweebit/react-essentials/blob/v0.6.0/src/hooks/useEventListener.ts#L120)

Adds `handler` as a listener for the event `eventName` of `element` with the
provided `options` applied

If `element` is `undefined`, `window` is used instead.

If `element` is `null`, no event listener is added.

### Example

```tsx
useEventListener('resize', () => {
  console.log(window.innerWidth, window.innerHeight);
});

useEventListener(
  'visibilitychange',
  () => console.log(document.visibilityState),
  document,
);

const buttonRef = useRef<HTMLButtonElement>(null);
useEventListener('click', () => console.log('click'), buttonRef.current);
```

### Type Parameters

| Type Parameter              |
| --------------------------- |
| `T` _extends_ `EventTarget` |

### Parameters

| Parameter   | Type                                   |
| ----------- | -------------------------------------- |
| `eventName` | `string`                               |
| `handler`   | (`this`, `event`) => `void`            |
| `element?`  | `null` \| `T`                          |
| `options?`  | `boolean` \| `AddEventListenerOptions` |

### Returns

`void`

---

## useForceUpdate()

```ts
function useForceUpdate(callback?): [() => void, bigint];
```

Defined in: [hooks/useForceUpdate.ts:32](https://github.com/aweebit/react-essentials/blob/v0.6.0/src/hooks/useForceUpdate.ts#L32)

Enables you to imperatively trigger re-rendering of components

This hook is designed in the most general way possible in order to cover all
imaginable use cases.

### Parameters

| Parameter   | Type         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `callback?` | () => `void` | An optional callback function to call during renders that were triggered with `forceUpdate()` Can be used for conditionally calling state setters when state needs to be reset. That is legal and better than using effects (see [You Might Not Need an Effect \> Adjusting some state when a prop changes](https://react.dev/learn/-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)), but can often be avoided by using [`useStateWithDeps`](#usestatewithdeps) or [`useReducerWithDeps`](#usereducerwithdeps). Important: the callback function is called once per render, not once per `forceUpdate` call! If React batches `forceUpdate` calls, then it will only be called once. |

### Returns

\[() => `void`, `bigint`\]

An array with the following two elements:

1. A `forceUpdate` function that triggers a re-render
2. The number of times `forceUpdate` has been called so far

---

## useReducerWithDeps()

```ts
function useReducerWithDeps<S, A>(
  reducer,
  initialState,
  deps,
): [S, ActionDispatch<A>];
```

Defined in: [hooks/useReducerWithDeps.ts:49](https://github.com/aweebit/react-essentials/blob/v0.6.0/src/hooks/useReducerWithDeps.ts#L49)

`useReducer` hook with an additional dependency array `deps` that resets the
state to `initialState` when dependencies change

### On linter support

The `react-hooks/exhaustive-deps` ESLint rule doesn't support hooks where
the dependency array parameter is at any other position than the second.
However, as we would like to keep the hook as compatible with `useReducer` as
possible, we don't want to artificially change the parameter's position.
Therefore, there will be no warnings about missing dependencies.
Because of that, additional caution is advised!
Be sure to check no dependencies are missing from the `deps` array.

Related issue: [https://github.com/facebook/react/issues/25443](https://github.com/facebook/react/issues/25443).

Unlike `eslint-plugin-react-hooks` maintained by React's team, the unofficial
`useExhaustiveDependencies` rule provided for Biome by Biome's team
does actually have support for dependency arrays at other positions, see
[useExhaustiveDependencies \> Options \> Validating dependencies](https://biomejs.dev/linter/rules/use-exhaustive-dependencies/#validating-dependencies).

### Type Parameters

| Type Parameter               |
| ---------------------------- |
| `S`                          |
| `A` _extends_ `AnyActionArg` |

### Parameters

| Parameter      | Type                             | Description                                                                                                                                                                                                                                                                                                               |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reducer`      | (`prevState`, ...`args`) => `S`  | The reducer function that specifies how the state gets updated                                                                                                                                                                                                                                                            |
| `initialState` | `S` \| (`previousState?`) => `S` | The value to which the state is set when the component is mounted or dependencies change It can also be a function that returns a state value. If the state is reset due to a change of dependencies, this function will be passed the previous state as its argument (will be `undefined` in the first call upon mount). |
| `deps`         | `DependencyList`                 | Dependencies that reset the state to `initialState`                                                                                                                                                                                                                                                                       |

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

Defined in: [hooks/useStateWithDeps.ts:31](https://github.com/aweebit/react-essentials/blob/v0.6.0/src/hooks/useStateWithDeps.ts#L31)

`useState` hook with an additional dependency array `deps` that resets the
state to `initialState` when dependencies change

### Type Parameters

| Type Parameter |
| -------------- |
| `S`            |

### Parameters

| Parameter      | Type                             | Description                                                                                                                                                                                                                                                                                                               |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialState` | `S` \| (`previousState?`) => `S` | The value to which the state is set when the component is mounted or dependencies change It can also be a function that returns a state value. If the state is reset due to a change of dependencies, this function will be passed the previous state as its argument (will be `undefined` in the first call upon mount). |
| `deps`         | `DependencyList`                 | Dependencies that reset the state to `initialState`                                                                                                                                                                                                                                                                       |

### Returns

\[`S`, `Dispatch`\<`SetStateAction`\<`S`\>\>\]

---

## createSafeContext()

For a given type `T`, returns a function that produces both a context of that
type and a hook that throws if a context value is required but none was
provided, or returns the context's value otherwise

### Param

An optional configuration object with the property `optional` that, when set
to `true`, results in the context value type being `T | undefined` and no
errors being thrown when no context value was provided

### Call Signature

```ts
function createSafeContext<T>(
  options?,
): <DisplayName>(displayName) => SafeContext<DisplayName, T>;
```

Defined in: [misc/createSafeContext.ts:31](https://github.com/aweebit/react-essentials/blob/v0.6.0/src/misc/createSafeContext.ts#L31)

#### Type Parameters

| Type Parameter                   | Default type |
| -------------------------------- | ------------ |
| `T` _extends_ \| `null` \| \{ \} | `never`      |

#### Parameters

| Parameter           | Type                        |
| ------------------- | --------------------------- |
| `options?`          | \{ `optional?`: `false`; \} |
| `options.optional?` | `false`                     |

#### Returns

```ts
<DisplayName>(displayName): SafeContext<DisplayName, T>;
```

##### Type Parameters

| Type Parameter                   |
| -------------------------------- |
| `DisplayName` _extends_ `string` |

##### Parameters

| Parameter     | Type                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `displayName` | \[`T`\] _extends_ \[`never`\] ? `never` : `ArgumentFallback`\<`DisplayName`, `never`, `string`\> |

##### Returns

[`SafeContext`](#safecontext)\<`DisplayName`, `T`\>

#### See

[`createSafeContext`](#createsafecontext)

### Call Signature

```ts
function createSafeContext<T>(
  options,
): <DisplayName>(displayName) => SafeContext<DisplayName, undefined | T>;
```

Defined in: [misc/createSafeContext.ts:42](https://github.com/aweebit/react-essentials/blob/v0.6.0/src/misc/createSafeContext.ts#L42)

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter          | Type                      |
| ------------------ | ------------------------- |
| `options`          | \{ `optional`: `true`; \} |
| `options.optional` | `true`                    |

#### Returns

```ts
<DisplayName>(displayName): SafeContext<DisplayName, undefined | T>;
```

##### Type Parameters

| Type Parameter                   |
| -------------------------------- |
| `DisplayName` _extends_ `string` |

##### Parameters

| Parameter     | Type                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `displayName` | \[`T`\] _extends_ \[`never`\] ? `never` : `ArgumentFallback`\<`DisplayName`, `never`, `string`\> |

##### Returns

[`SafeContext`](#safecontext)\<`DisplayName`, `undefined` \| `T`\>

#### See

[`createSafeContext`](#createsafecontext)
