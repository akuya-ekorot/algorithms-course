import { beforeEach, describe, expect, spyOn, test } from "bun:test";
import { Node } from "../../lessons/linked-lists/0-creating_linked_lists";
import { List } from "../../lessons/linked-lists/1-insertion_linked_lists";

let list: List<number>;
let node1: Node<number>;
let node2: Node<number>;
let node3: Node<number>;

beforeEach(() => {
  list = new List<number>();

  node1 = new Node(10);
  node2 = new Node(100);
  node3 = new Node(1000);

  node1.next = node2;
  node2.next = node3;

  list.head = node1;
});

describe("linked list", () => {
  test("inserts node at end of list", () => {
    const node = new Node(10_000);
    const spy = spyOn(console, "log");

    list.print();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls).toEqual([[10], [100], [1000]]);

    console.log("------");
    spy.mockClear();

    list.insertAtEnd(node);

    list.print();
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls).toEqual([[10], [100], [1000], [10_000]]);
    spy.mockClear();
  });

  test("inserts node at the start of the list", () => {
    const node = new Node(0);
    const spy = spyOn(console, "log");

    list.print();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls).toEqual([[10], [100], [1000]]);

    console.log("------");
    spy.mockClear();

    list.insertAtStart(node);

    list.print();
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls).toEqual([[0], [10], [100], [1000]]);
    spy.mockClear();
  });

  test("inserts node at given index of the list", () => {
    const node = new Node(50);
    const spy = spyOn(console, "log");

    list.print();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls).toEqual([[10], [100], [1000]]);

    console.log("------");
    spy.mockClear();

    list.insertAtIndex(node, 1);

    list.print();
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls).toEqual([[10], [50], [100], [1000]]);

    console.log("------");
    spy.mockClear();

    const anotherNode = new Node(0);
    list.insertAtIndex(anotherNode, 4);

    list.print();
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy.mock.calls).toEqual([[10], [50], [100], [1000], [0]]);
    spy.mockClear();
  });
});
