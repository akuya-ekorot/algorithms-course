import { describe, expect, spyOn, test } from "bun:test";
import { Node, List } from "../../lessons/linked-lists/0-creating_linked_lists";

describe("Singly linked list", () => {
  test("creates a node", () => {
    const node = new Node(10);

    expect(node.value).toBe(10);
    expect(node.next).toBeNull();
  });

  test("creates a linked list with no head node", () => {
    const list = new List<number>();

    expect(list.head).toBeNull();
  });

  test("creates a linked list with head", () => {
    const node = new Node(10);
    const list = new List(node);

    expect(list.head).toBe(node);
    expect(list.head?.value).toBe(10);
  });

  test("prints elements of a list", () => {
    const node = new Node(10);
    const node2 = new Node(100);

    node.next = node2;

    const list = new List(node);
    const spy = spyOn(console, "log");

    expect(spy).toHaveBeenCalledTimes(0);
    list.print();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls).toEqual([[10], [100]]);
  });
});
