import { useMemo, useRef, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect.js';

/**
 * The type of {@linkcode useEventListener}
 *
 * @see
 * {@linkcode useEventListener},
 * {@linkcode UseEventListenerWithImplicitWindowTarget},
 * {@linkcode UseEventListenerWithExplicitGlobalTarget},
 * {@linkcode UseEventListenerWithAnyExplicitTarget}
 */
export type UseEventListener = UseEventListenerWithImplicitWindowTarget &
  UseEventListenerWithExplicitGlobalTarget &
  UseEventListenerWithAnyExplicitTarget;

/**
 * @see
 * {@linkcode useEventListener},
 * {@linkcode UseEventListenerWithImplicitWindowTargetArgs}
 */
export type UseEventListenerWithImplicitWindowTarget = <
  K extends keyof WindowEventMap,
>(
  ...args: UseEventListenerWithImplicitWindowTargetArgs<K>
) => void;

/**
 * @see
 * {@linkcode useEventListener},
 * {@linkcode UseEventListenerWithExplicitTarget}
 */
export type UseEventListenerWithExplicitGlobalTarget =
  UseEventListenerWithExplicitTarget<Window, WindowEventMap> &
    UseEventListenerWithExplicitTarget<Document, DocumentEventMap> &
    UseEventListenerWithExplicitTarget<HTMLElement, HTMLElementEventMap> &
    UseEventListenerWithExplicitTarget<SVGElement, SVGElementEventMap> &
    UseEventListenerWithExplicitTarget<MathMLElement, MathMLElementEventMap>;

/**
 * @see
 * {@linkcode useEventListener},
 * {@linkcode UseEventListenerWithExplicitTargetArgs}
 */
export type UseEventListenerWithExplicitTarget<
  Target extends EventTarget,
  EventMap,
> = <T extends Target, K extends keyof EventMap>(
  ...args: UseEventListenerWithExplicitTargetArgs<EventMap, T, K>
) => void;

/**
 * @see
 * {@linkcode useEventListener},
 * {@linkcode UseEventListenerWithExplicitTarget}
 */
export type UseEventListenerWithAnyExplicitTarget =
  UseEventListenerWithExplicitTarget<EventTarget, Record<string, Event>>;

/**
 * @see
 * {@linkcode useEventListener},
 * {@linkcode UseEventListenerWithExplicitTargetArgs}
 */
export type UseEventListenerWithImplicitWindowTargetArgs<
  K extends keyof WindowEventMap,
> =
  UseEventListenerWithExplicitTargetArgs<WindowEventMap, Window, K> extends [
    unknown,
    ...infer Args,
  ]
    ? Args
    : never;

/**
 * @see
 * {@linkcode useEventListener}
 */
export type UseEventListenerWithExplicitTargetArgs<
  EventMap,
  T extends EventTarget,
  K extends keyof EventMap,
> = [
  target:
    | T
    // null has to be explicitly included because the definition of RefObject
    // doesn't have it in React 19
    | (RefObject<T | null | undefined> & { addEventListener?: never })
    | null
    | undefined,
  eventName: K,
  handler: (this: NoInfer<T>, event: EventMap[K]) => void,
  options?: AddEventListenerOptions | boolean | undefined,
];

type UseEventListenerWithImplicitWindowTargetArgsAny =
  UseEventListenerWithImplicitWindowTargetArgs<keyof WindowEventMap>;

type UseEventListenerWithExplicitTargetArgsAny =
  UseEventListenerWithExplicitTargetArgs<
    Record<string, Event>,
    EventTarget,
    string
  >;

/**
 * Adds `handler` as a listener for the event `eventName` of `target` with the
 * provided `options` applied
 *
 * The following call signatures are available:
 *
 * ```ts
 * function useEventListener(eventName, handler, options?): void;
 * function useEventListener(target, eventName, handler, options?): void;
 * ```
 *
 * For the full definition of the hook's type, see {@linkcode UseEventListener}.
 *
 * If `target` is not provided, `window` is used instead.
 *
 * If `target` is `null` or `undefined`, no event listener is added. This can be
 * used to add an event listener conditionally.
 *
 * `target` can also be a ref object created with {@linkcode useRef}. Beware
 * that in that case, changes to the ref's `current` value are only detected
 * correctly if a re-render happens at the same time it is changed. In other
 * words, it is required that whenever the ref's `current` value is updated,
 * some state in the component using the hook also changes at the same time.
 *
 * You should never use a ref's `current` value as `target` directly as that
 * violates the rule of React that forbids reading refs during rendering (see
 * [the `refs` rule](https://react.dev/reference/eslint-plugin-react-hooks/lints/refs)
 * of `eslint-plugin-react-hooks` for details).
 *
 * @example
 * ```tsx
 * useEventListener('resize', () => {
 *   console.log(window.innerWidth, window.innerHeight);
 * });
 *
 * useEventListener(document, 'visibilitychange', () => {
 *   console.log(document.visibilityState);
 * });
 *
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener(buttonRef, 'click', () => console.log('click'));
 * ```
 *
 * @see
 * {@linkcode UseEventListener}
 */
export const useEventListener: UseEventListener = function useEventListener(
  ...args:
    | UseEventListenerWithImplicitWindowTargetArgsAny
    | UseEventListenerWithExplicitTargetArgsAny
) {
  const [target, eventName, handler, options]: [
    target:
      | EventTarget
      | RefObject<EventTarget | null | undefined>
      | null
      | undefined,
    eventName: string,
    handler: (this: never, event: Event) => void,
    options?: AddEventListenerOptions | boolean | undefined,
  ] =
    typeof args[0] === 'string'
      ? [window, ...(args as UseEventListenerWithImplicitWindowTargetArgsAny)]
      : (args as UseEventListenerWithExplicitTargetArgsAny);

  const handlerRef = useRef(handler);
  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const {
    capture = false,
    once = false,
    passive,
    signal,
  } = typeof options === 'boolean' ? { capture: options } : (options ?? {});

  const memoizedOptions = useMemo(
    () => options,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [capture, once, passive, signal],
  );

  const depsRef = useRef<
    readonly [EventTarget | null | undefined, string, typeof options] | null
  >(null);

  const setupRef = useRef<(() => void) | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  useIsomorphicLayoutEffect(() => {
    setupRef.current?.();
    return () => cleanupRef.current?.();
  }, []);

  // We use a layout effect here because we want the event listener to already
  // have been added the moment the browser repaints the screen
  useIsomorphicLayoutEffect(() => {
    const unwrappedTarget =
      target && !('addEventListener' in target) ? target.current : target;

    const prevDeps = depsRef.current;
    const deps = [unwrappedTarget, eventName, memoizedOptions] as const;

    // == treats null and undefined as equal
    if (prevDeps && deps.every((dep, index) => dep == prevDeps[index])) {
      // Dependencies have not changed
      return;
    }

    depsRef.current = deps;

    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = setupRef.current = null;
    }

    if (unwrappedTarget == null) return;

    const listener: typeof handler = function (event) {
      handlerRef.current.call(this, event);
    };

    setupRef.current = () => {
      unwrappedTarget.addEventListener(eventName, listener, memoizedOptions);
    };

    cleanupRef.current = () => {
      unwrappedTarget.removeEventListener(eventName, listener, memoizedOptions);
    };

    setupRef.current();
  });
} as UseEventListener;
