import type { DependencyList } from 'react';

export function capitalize<T extends string>(str: T) {
  return (str && str[0]!.toUpperCase() + str.slice(1)) as Capitalize<T>;
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
