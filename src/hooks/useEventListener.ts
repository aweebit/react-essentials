import { useEffect, useMemo, useRef, type RefObject } from 'react';

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
  EventMap = Record<string, Event>,
> = <T extends Target, K extends keyof EventMap>(
  ...args: UseEventListenerWithExplicitTargetArgs<EventMap, T, K>
) => void;

/**
 * @see
 * {@linkcode useEventListener},
 * {@linkcode UseEventListenerWithExplicitTarget}
 */
export type UseEventListenerWithAnyExplicitTarget =
  UseEventListenerWithExplicitTarget<EventTarget>;

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
  target: T | (RefObject<T> & { addEventListener?: never }) | null,
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
 * If `target` is `null`, no event listener is added. This is useful when
 * working with DOM element refs, or when the event listener needs to be removed
 * temporarily.
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
    target: EventTarget | RefObject<EventTarget> | null,
    eventName: string,
    handler: (this: never, event: Event) => void,
    options?: AddEventListenerOptions | boolean | undefined,
  ] =
    typeof args[0] === 'string'
      ? [window, ...(args as UseEventListenerWithImplicitWindowTargetArgsAny)]
      : (args as UseEventListenerWithExplicitTargetArgsAny);

  const unwrappedTarget =
    target && !('addEventListener' in target) ? target.current : target;

  const handlerRef = useRef(handler);
  useEffect(() => {
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

  useEffect(() => {
    if (unwrappedTarget === null) {
      // No element has been attached to the ref yet
      return;
    }

    const listener: typeof handler = function (event) {
      handlerRef.current.call(this, event);
    };

    unwrappedTarget.addEventListener(eventName, listener, memoizedOptions);

    return () => {
      unwrappedTarget.removeEventListener(eventName, listener, memoizedOptions);
    };
  }, [unwrappedTarget, eventName, memoizedOptions]);
} as UseEventListener;
