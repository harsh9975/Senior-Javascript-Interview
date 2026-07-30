/**
 * Diffs two Virtual DOM nodes and returns a patch function.
 * @param {Object|string} oldVNode 
 * @param {Object|string} newVNode 
 * @returns {Function} patch(domNode)
 */
function diff(oldVNode, newVNode) {
  // Case 1: Node was removed
  if (newVNode === undefined) {
    return (node) => {
      node.remove();
      return null;
    };
  }

  // Case 2: Node was added
  if (oldVNode === undefined) {
    return (node) => {
      const newElement = render(newVNode);
      if (node && node.parentNode) {
        node.parentNode.appendChild(newElement);
      }
      return newElement;
    };
  }

  // Case 3: Text node changed or replacement (different node types or element tags)
  if (
    typeof oldVNode !== typeof newVNode ||
    (typeof oldVNode === 'string' && oldVNode !== newVNode) ||
    oldVNode.type !== newVNode.type
  ) {
    return (node) => {
      const newElement = render(newVNode);
      node.replaceWith(newElement);
      return newElement;
    };
  }

  // Case 4: Text node remains unchanged
  if (typeof oldVNode === 'string' || typeof oldVNode === 'number') {
    return (node) => node;
  }

  // Case 5: Same element type -> diff props and children recursively
  const patchProps = diffProps(oldVNode.props || {}, newVNode.props || {});
  const patchChildren = diffChildren(oldVNode.children || [], newVNode.children || []);

  return (node) => {
    patchProps(node);
    patchChildren(node);
    return node;
  };
}

/**
 * Diffs element attributes and event props
 */
function diffProps(oldProps = {}, newProps = {}) {
  return (node) => {
    // Set updated or new props
    for (const [key, value] of Object.entries(newProps)) {
      if (oldProps[key] !== value) {
        if (key.startsWith('on')) {
          const event = key.slice(2).toLowerCase();
          node[event] = value;
        } else {
          node.setAttribute(key, value);
        }
      }
    }

    // Remove old props absent in newProps
    for (const key of Object.keys(oldProps)) {
      if (!(key in newProps)) {
        if (key.startsWith('on')) {
          const event = key.slice(2).toLowerCase();
          node[event] = null;
        } else {
          node.removeAttribute(key);
        }
      }
    }
  };
}

/**
 * Positional diffing for children
 */
function diffChildren(oldChildren = [], newChildren = []) {
  const childPatches = [];
  const maxLen = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLen; i++) {
    childPatches.push(diff(oldChildren[i], newChildren[i]));
  }

  return (node) => {
    // Collect child nodes upfront because mutating childNodes in-place alters indices
    const childNodes = Array.from(node.childNodes);

    for (let i = 0; i < childPatches.length; i++) {
      childPatches[i](childNodes[i]);
    }
  };
}

/**
 * Converts a Virtual DOM node into a real DOM node
 */
function render(vNode) {
  if (typeof vNode === 'string' || typeof vNode === 'number') {
    return document.createTextNode(String(vNode));
  }

  const element = document.createElement(vNode.type);
  const props = vNode.props || {};

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on')) {
      const event = key.slice(2).toLowerCase();
      element[event] = value;
    } else {
      element.setAttribute(key, value);
    }
  }

  (vNode.children || []).forEach((child) => {
    element.appendChild(render(child));
  });

  return element;
}

module.exports = { diff, diffProps, diffChildren, render };
