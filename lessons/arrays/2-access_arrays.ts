export function accessAtIndex<T>(arr: T[], index: number): T | -1 {
  return arr[index] ?? -1;
}
