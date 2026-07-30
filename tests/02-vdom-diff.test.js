const assert = require('assert');

// Minimal DOM Mock for Node environment
class MockNode {
  constructor(nodeType) {
    this.nodeType = nodeType;
    this.parentNode = null;
    this.childNodes = [];
  }

  appendChild(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.childNodes.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.childNodes.indexOf(child);
    if (idx !== -1) {
      this.childNodes.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  replaceWith(newChild) {
    if (this.parentNode) {
      const idx = this.parentNode.childNodes.indexOf(this);
      if (idx !== -1) {
        this.parentNode.childNodes[idx] = newChild;
        newChild.parentNode = this.parentNode;
        this.parentNode = null;
      }
    }
  }

  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }
}

class MockElement extends MockNode {
  constructor(type) {
    super(1);
    this.type = type;
    this.attributes = {};
  }

  setAttribute(k, v) {
    this.attributes[k] = String(v);
  }

  getAttribute(k) {
    return this.attributes[k];
  }

  removeAttribute(k) {
    delete this.attributes[k];
  }
}

class MockTextNode extends MockNode {
  constructor(text) {
    super(3);
    this.nodeValue = String(text);
  }
}

global.document = {
  createElement: (type) => new MockElement(type),
  createTextNode: (text) => new MockTextNode(text)
};

const { diff, render } = require('../solutions/02-vdom-diff.js');

console.log('Running simplified Virtual DOM Diff tests...');

// 1. Render test
const vnode = {
  type: 'div',
  props: { id: 'app', class: 'container' },
  children: ['Hello', { type: 'span', props: {}, children: ['World'] }]
};

const node = render(vnode);
assert.strictEqual(node.type, 'div');
assert.strictEqual(node.getAttribute('id'), 'app');
assert.strictEqual(node.childNodes.length, 2);

// 2. Diff test - Update props & text
const vnode2 = {
  type: 'div',
  props: { id: 'app', class: 'updated' },
  children: ['Hello Updated', { type: 'span', props: {}, children: ['World'] }]
};

const patch = diff(vnode, vnode2);
patch(node);

assert.strictEqual(node.getAttribute('class'), 'updated');
assert.strictEqual(node.childNodes[0].nodeValue, 'Hello Updated');

// 3. Diff test - Replacement
const vnode3 = {
  type: 'p',
  props: {},
  children: ['Replaced']
};

const parent = document.createElement('main');
parent.appendChild(node);

const patchReplace = diff(vnode2, vnode3);
const newElement = patchReplace(node);

assert.strictEqual(parent.childNodes[0].type, 'p');
assert.strictEqual(newElement.type, 'p');

// 4. Diff test - Node removal & addition
const vnode4 = {
  type: 'div',
  props: {},
  children: [{ type: 'h1', props: {}, children: ['Title'] }]
};

const vnode5 = {
  type: 'div',
  props: {},
  children: []
};

const parent2 = document.createElement('div');
const dom4 = render(vnode4);
parent2.appendChild(dom4);

const patchRemoval = diff(vnode4, vnode5);
patchRemoval(dom4);
assert.strictEqual(dom4.childNodes.length, 0);

console.log('All Virtual DOM Diff tests passed successfully!');
