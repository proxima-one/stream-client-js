export function min(x: number, y: number): number {
  return x > y ? y : x;
}

export function max(x: number, y: number): number {
  return x < y ? y : x;
}

export function minLong(x: Long, y: Long): Long {
  return x.gt(y) ? y : x;
}

export function maxLong(x: Long, y: Long): Long {
  return x.lt(y) ? y : x;
}
