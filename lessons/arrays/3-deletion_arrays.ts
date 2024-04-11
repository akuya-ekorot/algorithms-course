export function deleteAtEnd<T>(arr: T[]) {
  arr.length = arr.length - 1;
} // arr.pop();

export function deleteAtStart<T>(arr: T[]) {
  const tempArray = arr;

  for (let i = 0; i < arr.length - 1; i++) {
    arr[i] = tempArray[i + 1];
  }

  arr.length = arr.length - 1;
} //arr.shift();

export function deleteAtIndex<T>(arr: T[], index: number) {
  const tempArray = arr;

  for (let i = 0; i < arr.length; i++) {
    if (i < index) {
      arr[i] = tempArray[i];
    } else if (i > index) {
      arr[i - 1] = tempArray[i];
    } else {
      continue;
    }
  }

  arr.length = arr.length - 1;
} // arr.splice(index, 1);
