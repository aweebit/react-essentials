import type {
  ComponentProps,
  JSXElementConstructor,
  default as React,
  ReactNode,
} from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { contextualize } from './contextualize.js';

/**
 * The return type of {@linkcode wrapJSX}
 *
 * @see
 * {@linkcode wrapJSX},
 * {@linkcode WrapJSXWith}
 */
export type JSXWrapPipe = {
  with: WrapJSXWith;
  end: () => ReactNode;
};

/**
 * @see
 * {@linkcode wrapJSX},
 * {@linkcode JSXWrapPipe}
 */
export type WrapJSXWith =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
    ...args: [
      Component: C,
      ...(Record<never, unknown> extends Omit<ComponentProps<C>, 'children'>
        ? [
            props?: React.JSX.IntrinsicAttributes &
              Omit<ComponentProps<C>, 'children'>,
          ]
        : [
            props: React.JSX.IntrinsicAttributes &
              Omit<ComponentProps<C>, 'children'>,
          ]),
    ]
  ) => JSXWrapPipe;

/**
 * An alternative way to compose JSX that avoids ever-increasing indentation
 *
 * A more general version of the context-specific {@linkcode contextualize}
 * function.
 *
 * @example
 * ```tsx
 * // Before:
 * createRoot(document.getElementById('root')!).render(
 *   <StrictMode>
 *     <I18nextProvider i18n={i18n}>
 *       <QueryClientProvider client={queryClient}>
 *         <NuqsAdapter>
 *           <ThemeProvider theme={theme}>
 *             <ToasterProvider>
 *               <App />
 *             </ToasterProvider>
 *           </ThemeProvider>
 *         </NuqsAdapter>
 *       </QueryClientProvider>
 *     </I18nextProvider>
 *   </StrictMode>,
 * );
 *
 * // After:
 * createRoot(document.getElementById('root')!).render(
 *   wrapJSX(<App />)
 *     .with(ToasterProvider)
 *     .with(ThemeProvider, { theme })
 *     .with(NuqsAdapter)
 *     .with(QueryClientProvider, { client: queryClient })
 *     .with(I18nextProvider, { i18n })
 *     .with(StrictMode)
 *     .end(),
 * );
 * ```
 *
 * @param children The children to wrap
 *
 * @returns An object with the following properties:
 * - `with`: a function that accepts a component `Component` and props `props`
 *   for it as arguments and returns
 *   `wrapJSX(<Component {...props}>{children}</Component>)`
 * - `end`: a function that returns `children`
 *
 * @see
 * {@linkcode JSXWrapPipe}
 */
export function wrapJSX(children: ReactNode): JSXWrapPipe {
  return {
    with(
      Component:
        | keyof React.JSX.IntrinsicElements
        | JSXElementConstructor<object>,
      props: object = {},
    ) {
      return wrapJSX(<Component {...props}>{children}</Component>);
    },
    end() {
      return children;
    },
  };
}
