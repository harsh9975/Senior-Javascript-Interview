# Question 2: Implement Virtual DOM Diff (`diff` & `render`)

Implement a simplified Virtual DOM diff function for an interview setting.

## Problem Statement

Given two Virtual DOM nodes (`oldVNode` and `newVNode`), write a `diff` function that compares them and returns a `patch(domNode)` function to update the real DOM node in-place.

## Requirements

1. **VNode Types**: A VNode can be a primitive string/number (text node) or an object `{ type, props, children }`.
2. **Cases to Handle**:
   - **Node Removal** (`newVNode === undefined`): Remove the node from DOM.
   - **Node Addition** (`oldVNode === undefined`): Render `newVNode` and append to parent.
   - **Node Replacement** (Different types or string changed): Replace the existing node with `render(newVNode)`.
   - **Unchanged Primitives**: Return a no-op patch.
   - **Same Element Type**: Diff props (`diffProps`) and diff children recursively (`diffChildren`).

## Solution Code

Check the implementation here: [solutions/02-vdom-diff.js](https://github.com/harsh9975/Senior-Javascript-Interview/blob/master/solutions/02-vdom-diff.js).

## Unit Tests

Check the test suite here: [tests/02-vdom-diff.test.js](https://github.com/harsh9975/Senior-Javascript-Interview/blob/master/tests/02-vdom-diff.test.js).
