/**
 * @file Based on {@link https://github.com/juliencrn/usehooks-ts}
 *
 * @license MIT
 * @copyright 2020 Julien CARON
 */

import { useEffect, useMemo, useRef } from 'react';

/**
 * The type of {@linkcode useEventListener}
 *
 * @see
 * {@linkcode useEventListener},
 * {@linkcode UseEventListenerWithImplicitWindowTarget},
 * {@linkcode UseEventListenerWithExplicitTarget},
 * {@linkcode UseEventListenerWithAnyExplicitTarget}
 */
export type UseEventListener = UseEventListenerWithImplicitWindowTarget &
  UseEventListenerWithExplicitTarget<Window, WindowEventMap> &
  UseEventListenerWithExplicitTarget<Document, DocumentEventMap> &
  UseEventListenerWithExplicitTarget<HTMLElement, HTMLElementEventMap> &
  UseEventListenerWithExplicitTarget<SVGElement, SVGElementEventMap> &
  UseEventListenerWithExplicitTarget<MathMLElement, MathMLElementEventMap> &
  UseEventListenerWithAnyExplicitTarget;

/**
 * @see
 * {@linkcode useEventListener},
 * {@linkcode UseEventListenerWithImplicitWindowTargetArgs} */
export type UseEventListenerWithImplicitWindowTarget = <
  K extends keyof WindowEventMap,
>(
  ...args: UseEventListenerWithImplicitWindowTargetArgs<K>
) => void;

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
  target: T | null,
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
 * For the full definition of the function type, see
 * {@linkcode UseEventListener}.
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
 * useEventListener(buttonRef.current, 'click', () => console.log('click'));
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
  let eventName: string;
  let handler: (this: never, event: Event) => void;
  let target: EventTarget | null | undefined;
  let options: AddEventListenerOptions | boolean | undefined;

  if (typeof args[0] === 'string') {
    [eventName, handler, options] =
      args as UseEventListenerWithImplicitWindowTargetArgsAny;
  } else {
    [target, eventName, handler, options] =
      args as UseEventListenerWithExplicitTargetArgsAny;
  }

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

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
    if (target === null) {
      // No element has been attached to the ref yet
      return;
    }

    const definedTarget = target ?? window;

    const listener: typeof handler = function (event) {
      handlerRef.current.call(this, event);
    };

    definedTarget.addEventListener(eventName, listener, memoizedOptions);

    return () => {
      definedTarget.removeEventListener(eventName, listener, memoizedOptions);
    };
  }, [eventName, target, memoizedOptions]);
} as UseEventListener;
