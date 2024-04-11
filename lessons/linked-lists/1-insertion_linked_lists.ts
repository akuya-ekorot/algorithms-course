import { Node } from "./0-creating_linked_lists";

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

  /**
   * insert node at the start of linked list
   */
  insertAtStart(node: Node<T>) {
    node.next = this.head;
    this.head = node;
  }

  /**
   * insert node at the given index
   */
  insertAtIndex(node: Node<T>, index: number) {
    if (index === 0) {
      this.insertAtStart(node);
      return;
    }

    let count = 0;
    let curr = this.head;

    while (curr && count < index) {
      node.next = curr;
      curr = curr.next;
      count++;
    }

    node.next!.next = node;
    node.next = curr;
  }

  /**
   * insert node at the end of linked list
   */
  insertAtEnd(node: Node<T>) {
    let curr = this.head;

    if (curr === null) {
      this.head = curr;
    } else {
      while (curr && curr.next) {
        curr = curr.next;
      }

      if (curr) {
        curr.next = node;
      }
    }
  }
}
