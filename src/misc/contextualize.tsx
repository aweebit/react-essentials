import type { Context, default as React } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { wrapJSX } from './wrapJSX.js';

/**
 * The return type of {@linkcode contextualize}
 *
 * @see
 * {@linkcode contextualize},
 * {@linkcode ContextualizeWith}
 */
export type ContextualizePipe = {
  with: ContextualizeWith;
  end: () => React.JSX.Element | undefined;
};

/**
 * @see
 * {@linkcode contextualize},
 * {@linkcode ContextualizePipe}
 */
export type ContextualizeWith = <T>(
  Context: Context<T>,
  value: NoInfer<T>,
) => ContextualizePipe;

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
 *           <Header />
 *           <Main />
 *           <Footer />
 *         </EventHandlersContext.Provider>
 *       </FlashcardsContext.Provider>
 *     </DeckIdContext.Provider>
 *   </CourseIdContext.Provider>
 * );
 *
 * // After:
 * const jsx = (
 *   <>
 *     <Header />
 *     <Main />
 *     <Footer />
 *   </>
 * );
 *
 * return contextualize(jsx)
 *   .with(EventHandlersContext, eventHandlers)
 *   .with(FlashcardsContext, flashcards)
 *   .with(DeckIdContext, deckId)
 *   .with(CourseIdContext, courseId)
 *   .end();
 * ```
 *
 * @param jsx The JSX to contextualize
 *
 * @returns An object with the following properties:
 * - `with`: a function that accepts a context `Context` and a value `value` for
 *   it as arguments and returns
 *   `contextualize(<Context.Provider value={value}>{jsx}</Context.Provider>)`
 * - `end`: a function that returns `jsx`
 *
 * @see
 * {@linkcode ContextualizePipe}
 */
export function contextualize(
  jsx: React.JSX.Element | undefined,
): ContextualizePipe {
  return {
    with<T>(Context: Context<T>, value: T) {
      return contextualize(
        <Context.Provider value={value}>{jsx}</Context.Provider>,
      );
    },
    end() {
      return jsx;
    },
  };
}
