export type ReadonlyLookup<T> = Readonly<Record<string, T>>;
export type Lookup<T> = Record<string, T>;

export function toReadonlyLookup<T>(array: ReadonlyArray<T>, indexSelector: (item: T) => string): ReadonlyLookup<T> {
  return toLookup(array, indexSelector);
}

export function mapToReadonlyLookup<T, V>(array: ReadonlyArray<T>, indexSelector: (item: T) => string, mapFunc: (item: T) => V): ReadonlyLookup<V> {
  return mapToLookup(array, indexSelector, mapFunc);
}

export function toLookup<T>(array: ReadonlyArray<T>, indexSelector: (item: T) => string): Lookup<T> {
  const lookup: Lookup<T> = {};
  for (let item of array)
    lookup[indexSelector(item)] = item;
  return lookup;
}

export function mapLookup<T, V>(lookup: ReadonlyLookup<T>, func: (item: T, key: string) => V): Lookup<V> {
  return mapToLookup(Object.entries(lookup), x => x[0], x => func(x[1], x[0]));
}

export function mapToLookup<T, V>(array: ReadonlyArray<T>, indexSelector: (item: T) => string, mapFunc: (item: T) => V): Lookup<V> {
  const lookup: Lookup<V> = {};
  for (let item of array)
    lookup[indexSelector(item)] = mapFunc(item);
  return lookup;
}

export function toArray<T>(args: T | T[] | undefined): T[] {
  if (args == undefined)
    return [];
  if (Array.isArray(args))
    return args;
  return [args];
}
