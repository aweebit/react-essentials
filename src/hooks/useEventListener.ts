/**
 * @file Based on {@link https://github.com/juliencrn/usehooks-ts}
 *
 * @license MIT
 * @copyright 2020 Julien CARON
 */

import { useEffect, useMemo, useRef } from 'react';

type UseEventListenerOverloadArgs<
  EventMap,
  K extends keyof EventMap,
  T extends EventTarget,
> = [
  target: T | null,
  eventName: K,
  handler: (this: NoInfer<T>, event: EventMap[K]) => void,
  options?: AddEventListenerOptions | boolean,
];

/**
 * Adds `handler` as a listener for the event `eventName` of `target` with the
 * provided `options` applied
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
 * @ignore
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (this: Window, event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean,
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<K extends keyof WindowEventMap>(
  ...args: UseEventListenerOverloadArgs<WindowEventMap, K, Window>
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<K extends keyof DocumentEventMap>(
  ...args: UseEventListenerOverloadArgs<DocumentEventMap, K, Document>
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement,
>(...args: UseEventListenerOverloadArgs<HTMLElementEventMap, K, T>): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof SVGElementEventMap,
  T extends SVGElement,
>(...args: UseEventListenerOverloadArgs<SVGElementEventMap, K, T>): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof MathMLElementEventMap,
  T extends MathMLElement,
>(...args: UseEventListenerOverloadArgs<MathMLElementEventMap, K, T>): void;

/**
 * @see {@linkcode useEventListener}
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (this: Window, event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean,
): void;

/**
 * @see {@linkcode useEventListener}
 */
export function useEventListener<T extends EventTarget>(
  target: T | null,
  eventName: string,
  handler: (this: NoInfer<T>, event: Event) => void,
  options?: AddEventListenerOptions | boolean,
): void;

/**
 * Adds `handler` as a listener for the event `eventName` of `target` with the
 * provided `options` applied
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
 */
export function useEventListener(
  ...args: UseEventListenerArgsWithoutTarget | UseEventListenerArgsWithTarget
) {
  let eventName: string;
  let handler: (this: EventTarget, event: Event) => void;
  let target: EventTarget | null | undefined;
  let options: AddEventListenerOptions | boolean | undefined;

  if (typeof args[0] === 'string') {
    [eventName, handler, options] = args as UseEventListenerArgsWithoutTarget;
  } else {
    [target, eventName, handler, options] =
      args as UseEventListenerArgsWithTarget;
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

type UseEventListenerArgsWithoutTarget = [
  eventName: string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions | boolean | undefined,
];

type UseEventListenerArgsWithTarget = [
  target: EventTarget | null,
  eventName: string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions | boolean | undefined,
];
