/**
 * @file Based on {@link https://github.com/juliencrn/usehooks-ts}
 *
 * @license MIT
 * @copyright 2020 Julien CARON
 */

import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Adds `handler` as a listener for the event `eventName` of `element`
 * (or `window` by default) with the provided `options` applied
 *
 * It is the user's responsibility to make sure `element` and `options` values
 * are correctly memoized!
 */

// SVGElement Event based useEventListener interface
function useEventListener<
  K extends keyof SVGElementEventMap,
  T extends SVGElement,
>(
  eventName: K,
  handler: (this: T, event: SVGElementEventMap[K]) => void,
  element: T,
  options?: boolean | AddEventListenerOptions,
): void;

// HTMLElement Event based useEventListener interface
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement,
>(
  eventName: K,
  handler: (this: T, event: HTMLElementEventMap[K]) => void,
  element: T,
  options?: boolean | AddEventListenerOptions,
): void;

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (this: Document, event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions,
): void;

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (this: Window, event: WindowEventMap[K]) => void,
  element?: Window,
  options?: boolean | AddEventListenerOptions,
): void;

// Fallback overload for all other event targets and types
function useEventListener<T extends EventTarget>(
  eventName: string,
  handler: (this: T, event: Event) => void,
  element?: T,
  options?: boolean | AddEventListenerOptions,
): void;

function useEventListener(
  eventName: string,
  handler: (this: EventTarget, event: Event) => void,
  element?: EventTarget,
  options?: boolean | AddEventListenerOptions,
) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler);

  useLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Define the listening target
    const targetElement = element ?? window;

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = function (event) {
      savedHandler.current.call(this, event);
    };

    targetElement.addEventListener(eventName, listener, options);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}

export default useEventListener;
