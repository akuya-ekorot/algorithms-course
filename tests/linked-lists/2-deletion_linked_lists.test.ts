import { beforeEach, describe, expect, spyOn, test } from "bun:test";
import { Node } from "../../lessons/linked-lists/0-creating_linked_lists";
import { List } from "../../lessons/linked-lists/2-deletion_linked_lists";

let list: List<number>;
let node1: Node<number>;
let node2: Node<number>;
let node3: Node<number>;

const spy = spyOn(console, "log");

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
  test("delete at start of list", () => {
    list.print();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls).toEqual([[10], [100], [1000]]);

    console.log("------");
    spy.mockClear();

    list.deleteAtStart();

    list.print();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls).toEqual([[100], [1000]]);

    console.log("------");
    spy.mockClear();

    list.deleteAtStart();

    list.print();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls).toEqual([[1000]]);

    console.log("------");
    spy.mockClear();

    list.deleteAtStart();

    list.print();
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockClear();
  });

  test("delete at the end of the list", () => {
    list.print();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls).toEqual([[10], [100], [1000]]);

    console.log("------");
    spy.mockClear();

    list.deleteAtEnd();

    list.print();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls).toEqual([[10], [100]]);

    console.log("------");
    spy.mockClear();

    list.deleteAtEnd();

    list.print();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls).toEqual([[10]]);

    console.log("------");
    spy.mockClear();

    list.deleteAtEnd();

    list.print();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
