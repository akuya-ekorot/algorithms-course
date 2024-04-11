/**
 * return's the nth number in the fibonacci sequence
 */
export default function fibonacci(n: number): number {
  if (n === 1) {
    return 0;
  }

  if (n <= 2) {
    return 1;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}
