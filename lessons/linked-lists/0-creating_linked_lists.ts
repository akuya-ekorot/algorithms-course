export class Node<T> {
  _value: T;
  _next: Node<T> | null;

  constructor(value: T, next?: Node<T>) {
    this._value = value;
    this._next = next ?? null;
  }

  get value() {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
  }

  get next() {
    return this._next;
  }

  set next(next: Node<T> | null) {
    this._next = next;
  }
}

export class List<T> {
  _head: Node<T> | null;

  constructor(head?: Node<T>) {
    this._head = head ?? null;
  }

  get head() {
    return this._head;
  }

  set head(head: Node<T> | null) {
    this._head = head;
  }

  /**
   * prints all elements of a list
   */
  print() {
    let curr = this.head;

    while (curr) {
      console.log(curr.value);
      curr = curr.next;
    }
  }
}
