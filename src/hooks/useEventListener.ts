/**
 * @file Based on {@link https://github.com/juliencrn/usehooks-ts}
 *
 * @license MIT
 * @copyright 2020 Julien CARON
 */

import { useEffect, useMemo, useRef } from 'react';

type UseEventListenerOverloadArgsTargetFirst<
  EventMap,
  K extends keyof EventMap,
  T extends EventTarget,
> = [
  target: T | null,
  eventName: K,
  handler: (this: NoInfer<T>, event: EventMap[K]) => void,
  options?: AddEventListenerOptions | boolean,
];

type UseEventListenerOverloadArgsEventNameFirst<
  EventMap,
  K extends keyof EventMap,
  T extends EventTarget,
> = [
  eventName: K,
  handler: (this: NoInfer<T>, event: EventMap[K]) => void,
  target: T | null,
  options?: AddEventListenerOptions | boolean,
];

/**
 * Adds `handler` as a listener for the event `eventName` of `target` with the
 * provided `options` applied
 *
 * If `target` is `undefined` or not provided, `window` is used instead.
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
 * @ignore
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (this: Window, event: WindowEventMap[K]) => void,
  target?: Window | null,
  options?: AddEventListenerOptions | boolean,
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<K extends keyof WindowEventMap>(
  target: Window | null | undefined,
  eventName: K,
  handler: (this: Window, event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean,
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<K extends keyof DocumentEventMap>(
  ...args: UseEventListenerOverloadArgsTargetFirst<
    DocumentEventMap,
    K,
    Document
  >
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<K extends keyof DocumentEventMap>(
  ...args: UseEventListenerOverloadArgsEventNameFirst<
    DocumentEventMap,
    K,
    Document
  >
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement,
>(
  ...args: UseEventListenerOverloadArgsTargetFirst<HTMLElementEventMap, K, T>
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement,
>(
  ...args: UseEventListenerOverloadArgsEventNameFirst<HTMLElementEventMap, K, T>
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof SVGElementEventMap,
  T extends SVGElement,
>(
  ...args: UseEventListenerOverloadArgsTargetFirst<SVGElementEventMap, K, T>
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof SVGElementEventMap,
  T extends SVGElement,
>(
  ...args: UseEventListenerOverloadArgsEventNameFirst<SVGElementEventMap, K, T>
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof MathMLElementEventMap,
  T extends MathMLElement,
>(
  ...args: UseEventListenerOverloadArgsTargetFirst<MathMLElementEventMap, K, T>
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof MathMLElementEventMap,
  T extends MathMLElement,
>(
  ...args: UseEventListenerOverloadArgsEventNameFirst<
    MathMLElementEventMap,
    K,
    T
  >
): void;

/**
 * @see {@linkcode useEventListener}
 */
export function useEventListener<K extends string, T extends EventTarget>(
  target: T | null | undefined,
  eventName: K,
  handler: (this: NoInfer<T>, event: Event) => void,
  options?: AddEventListenerOptions | boolean,
): void;

/**
 * @see {@linkcode useEventListener}
 */
export function useEventListener<K extends string, T extends EventTarget>(
  eventName: K,
  handler: (this: NoInfer<T>, event: Event) => void,
  target?: T | null,
  options?: AddEventListenerOptions | boolean,
): void;

/**
 * @see {@linkcode useEventListener}
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (this: Window, event: WindowEventMap[K]) => void,
  options: AddEventListenerOptions | boolean,
): void;

/**
 * Adds `handler` as a listener for the event `eventName` of `target` with the
 * provided `options` applied
 *
 * If `target` is `undefined` or not provided, `window` is used instead.
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
 */
export function useEventListener(
  ...args:
    | UseEventListenerArgsTargetFirst
    | UseEventListenerArgsEventNameFirst
    | UseEventListenerArgsWithoutTarget
) {
  let eventName: string;
  let handler: (this: EventTarget, event: Event) => void;
  let target: EventTarget | null | undefined;
  let options: AddEventListenerOptions | boolean | undefined;

  if (typeof args[0] !== 'string') {
    [target, eventName, handler, options] =
      args as UseEventListenerArgsTargetFirst;
  } else if (
    args[2] == null ||
    (typeof args[2] === 'object' && 'addEventListener' in args[2])
  ) {
    [eventName, handler, target, options] =
      args as UseEventListenerArgsEventNameFirst;
  } else {
    [eventName, handler, options] = args as UseEventListenerArgsWithoutTarget;
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
}

type UseEventListenerArgsTargetFirst = [
  target: EventTarget | null | undefined,
  eventName: string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions | boolean | undefined,
];

type UseEventListenerArgsEventNameFirst = [
  eventName: string,
  handler: (event: Event) => void,
  target?: EventTarget | null | undefined,
  options?: AddEventListenerOptions | boolean | undefined,
];

type UseEventListenerArgsWithoutTarget = [
  eventName: string,
  handler: (event: Event) => void,
  options: AddEventListenerOptions | boolean,
];
