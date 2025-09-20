/**
 * @file Based on {@link https://github.com/juliencrn/usehooks-ts}
 *
 * @license MIT
 * @copyright 2020 Julien CARON
 */

import { useEffect, useMemo, useRef } from 'react';

/**
 * Adds `handler` as a listener for the event `eventName` of `element` with the
 * provided `options` applied
 *
 * If `element` is `undefined`, `window` is used instead.
 *
 * If `element` is `null`, no event listener is added.
 *
 * @example
 * ```tsx
 * useEventListener('resize', () => {
 *   console.log(window.innerWidth, window.innerHeight);
 * });
 *
 * useEventListener(
 *   'visibilitychange',
 *   () => console.log(document.visibilityState),
 *   document
 * );
 *
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener("click", () => console.log("click"), buttonRef.current);
 * ```
 *
 * @ignore
 */
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement,
>(
  eventName: K,
  handler: (this: NoInfer<T>, event: HTMLElementEventMap[K]) => void,
  element: T | null,
  options?: boolean | AddEventListenerOptions,
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof SVGElementEventMap,
  T extends SVGElement,
>(
  eventName: K,
  handler: (this: NoInfer<T>, event: SVGElementEventMap[K]) => void,
  element: T | null,
  options?: boolean | AddEventListenerOptions,
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<
  K extends keyof MathMLElementEventMap,
  T extends MathMLElement,
>(
  eventName: K,
  handler: (this: NoInfer<T>, event: MathMLElementEventMap[K]) => void,
  element: T | null,
  options?: boolean | AddEventListenerOptions,
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (this: Document, event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions,
): void;

/**
 * @see {@linkcode useEventListener}
 * @ignore
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (this: Window, event: WindowEventMap[K]) => void,
  element?: Window,
  options?: boolean | AddEventListenerOptions,
): void;

/**
 * Adds `handler` as a listener for the event `eventName` of `element` with the
 * provided `options` applied
 *
 * If `element` is `undefined`, `window` is used instead.
 *
 * If `element` is `null`, no event listener is added.
 *
 * @example
 * ```tsx
 * useEventListener('resize', () => {
 *   console.log(window.innerWidth, window.innerHeight);
 * });
 *
 * useEventListener(
 *   'visibilitychange',
 *   () => console.log(document.visibilityState),
 *   document
 * );
 *
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener("click", () => console.log("click"), buttonRef.current);
 * ```
 */
export function useEventListener<T extends EventTarget>(
  eventName: string,
  handler: (this: NoInfer<T>, event: Event) => void,
  element?: T | null,
  options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener(
  eventName: string,
  handler: (this: EventTarget, event: Event) => void,
  element?: EventTarget | null,
  options?: boolean | AddEventListenerOptions,
) {
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
    if (element === null) {
      // No element has been attached to the ref yet
      return;
    }

    // Define the listening target
    const targetElement = element ?? window;

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = function (event) {
      handlerRef.current.call(this, event);
    };

    targetElement.addEventListener(eventName, listener, memoizedOptions);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, memoizedOptions);
    };
  }, [eventName, element, memoizedOptions]);
}
