import type { Context, Provider, ReactElement, ReactNode } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { wrapJSX } from './wrapJSX.js';

/**
 * The return type of {@linkcode contextualize}
 *
 * @see
 * {@linkcode contextualize},
 * {@linkcode ContextualizeWith}
 */
export type ContextualizePipe<Children extends ReactNode> = {
  with: ContextualizeWith;
  end: () => Children;
};

/**
 * @see
 * {@linkcode contextualize},
 * {@linkcode ContextualizePipe}
 */
export type ContextualizeWith = <T>(
  Provider: Provider<T> | Context<T>,
  value: NoInfer<T>,
) => ContextualizePipe<ReactElement>;

/**
 * An alternative way to provide context values to component trees that avoids
 * ever-increasing indentation
 *
 * A context-specific version of the more general {@linkcode wrapJSX} function.
 *
 * @example
 * ```tsx
 * // Before:
 * return (
 *   <CourseIdContext.Provider value={courseId}>
 *     <DeckIdContext.Provider value={deckId}>
 *       <FlashcardsContext.Provider value={flashcards}>
 *         <EventHandlersContext.Provider value={eventHandlers}>
 *           {children}
 *         </EventHandlersContext.Provider>
 *       </FlashcardsContext.Provider>
 *     </DeckIdContext.Provider>
 *   </CourseIdContext.Provider>
 * );
 *
 * // After:
 * return contextualize(children)
 *   .with(EventHandlersContext, eventHandlers)
 *   .with(FlashcardsContext, flashcards)
 *   .with(DeckIdContext, deckId)
 *   .with(CourseIdContext, courseId)
 *   .end();
 * ```
 *
 * @param children The children to contextualize
 *
 * @returns An object with the following properties:
 * - `with`: a function that accepts a context provider `Provider` (or the
 *   context it belongs to) and a value `value` for that context as arguments
 *   and returns `contextualize(<Provider value={value}>{children}</Provider>)`
 * - `end`: a function that returns `children`
 *
 * @see
 * {@linkcode ContextualizePipe}
 */
export function contextualize<Children extends ReactNode>(
  children: Children,
): ContextualizePipe<Children> {
  return {
    with<T>(Provider: Provider<T> | Context<T>, value: T) {
      if ('Provider' in Provider) Provider = Provider.Provider;
      return contextualize(<Provider value={value}>{children}</Provider>);
    },
    end() {
      return children;
    },
  };
}
