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
   * delete the first node in the list
   */
  deleteAtStart() {
    if (this.head) {
      this.head = this.head.next;
    }
  }

  /**
   * delete the last node in the list
   */
  deleteAtEnd() {
    let curr = this.head;

    if (curr && !curr.next) {
      this.head = null;
      return;
    }

    while (curr && curr.next && curr.next.next) {
      curr = curr.next;
    }

    if (curr && curr.next) {
      curr.next = null;
    }
  }

  /**
   * delete node at the given index
   */
  deleteAtIndex(index: number) {
    if (index === 0) {
      this.deleteAtStart();
      return;
    }

    let count = 0;
    let curr = this.head;

    while (curr && count < index) {
      curr = curr.next;
      count++;
    }
  }
}
