import { ConditionalPick } from "type-fest";

export function pickBy<T, U extends T[keyof T]>(
  obj: T,
  predicate: (value: T[keyof T]) => value is U
): ConditionalPick<T, U>;
export function pickBy<T>(obj: T, predicate: (value: T[keyof T]) => boolean): T;
export function pickBy<T>(obj: T, predicate: (value: T[keyof T]) => boolean) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => predicate(value))
  );
}
