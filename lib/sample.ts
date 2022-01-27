import invariant from "tiny-invariant";
import { random } from "./random";

export function sample<T>(array: readonly T[]): T {
  return array[random(0, array.length - 1)];
}

export function sampleSize<T>(array: readonly T[], size: number): T[] {
  invariant(size <= array.length);
  const seen = new Set<T>();

  while (seen.size < size) {
    seen.add(sample(array));
  }

  return [...seen.values()];
}
