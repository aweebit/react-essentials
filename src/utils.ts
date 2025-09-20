import type { DependencyList } from 'react';

export type Callable = (...args: never) => unknown;

export type ArgumentFallback<
  T extends Base,
  Default extends Base,
  Base = unknown,
> = [T] extends [never] ? Default : [Base] extends [T] ? Default : T;

export function noop() {}

export function isFunction(input: unknown): input is Callable {
  return typeof input === 'function';
}

export function depsAreEqual(
  prevDeps: DependencyList,
  deps: DependencyList,
): boolean {
  return (
    prevDeps.length === deps.length &&
    deps.every((dep, index) => Object.is(dep, prevDeps[index]))
  );
}
