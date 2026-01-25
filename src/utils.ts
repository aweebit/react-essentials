import type { DependencyList } from 'react';

export function depsAreEqual(
  prevDeps: DependencyList,
  deps: DependencyList,
): boolean {
  return (
    prevDeps.length === deps.length &&
    deps.every((dep, index) => Object.is(dep, prevDeps[index]))
  );
}
