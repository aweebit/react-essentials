import type { DependencyList } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(input: unknown): input is Function {
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
