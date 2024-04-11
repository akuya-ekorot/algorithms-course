export function insertAtEnd<T>(arr: T[], element: T) {
  arr[arr.length] = element;
} // arr.push(element);

export function insertAtStart<T>(arr: T[], element: T) {
  const tempArray = Array.from(arr);

  arr[0] = element;

  for (let i = 0; i < tempArray.length; i++) {
    arr[i + 1] = tempArray[i];
  }
} //arr.unshift(element);

export function insertAtIndex<T>(arr: T[], element: T, index: number) {
  const tempArray = Array.from(arr);

  for (let i = 0; i < arr.length + 1; i++) {
    if (i === index) {
      arr[i] = element;
    } else {
      arr[i] = tempArray[i - 1];
    }
  }
} // arr.splice(index, 0, element);
