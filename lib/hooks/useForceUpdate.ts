import { useReducer } from 'react';

export default function useForceUpdate(): [
  () => void,
  Record<PropertyKey, never>,
] {
  const [value, forceUpdate] = useReducer(() => ({}), {});
  return [forceUpdate, value];
}
