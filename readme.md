# js-sdk-vdom

this is a very simple implementation of the virtual DOM algorithm.

it's a great implementation for short and stable trees (with no much update).

current version compiled size:

- es5 2.1k (1.1k gzipped)
- es2022 1.3k (705 gzipped)

## usage

```js
let tree = null,
    state = {};

const target = document.querySelector('#app');

function app(dispatch, state) {
  return N(
    'button',
    {},
    { click: function() { dispatch(new AppEvent()); } },
    [T("Click here")]
  );
}

function render() {
  function dispatch(event) {
    // do state management/transition
    render();
  }

  tree = patch(tree, app(dispatch, state), target);
}
```

## license

Released under MIT license. See `license`.
