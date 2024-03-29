/* @jest-environment jsdom */

const { patch, T, N } = require('./index.js');

const clean = () => (document.body.innerHTML = "");

describe('empty case', () => {
  it('do nothing', () => {
    let r1 = patch(null, null, document.body);
    expect(r1).toBeNull();
  });
});

describe('creating nodes', () => {
  afterEach(clean);

  it('text node', () => {
    let r1 = patch(null, T('text'), document.body);
    expect(r1.s).toBe('text');
    expect(r1.n).not.toBeNull();
  });

  it('node', () => {
    let r1 = patch(null, N('div', {}, {}, []), document.body);
    expect(r1.n.nodeName).toBe('DIV');
    expect(r1.n.children.length).toBe(0);
  });
});

describe('deleting nodes', () => {
  afterEach(clean);

  it('text node', () => {
    let r1 = patch(null, T('text'), document.body);
    r1 = patch(r1, null, document.body);
    expect(r1).toBeNull();
  });

  it('node', () => {
    let r1 = patch(null, N('div', {}, {}, []), document.body);
    r1 = patch(r1, null, document.body);
    expect(r1).toBeNull();
  });

  it('children node', () => {
    let n1 = N('div', {}, {}, [T('a')]);
    let n2 = N('div', {}, {}, []);
    let r1 = patch(null, n1, document.body);
    r1 = patch(r1, n2, document.body);
    expect(r1.c.length).toBe(0);
  });
});

describe('updating nodes', () => {
  afterEach(clean);

  it('text node', () => {
    let r1 = patch(null, T('a'), document.body);
    r1 = patch(r1, T('b'), document.body);

    expect(r1.s).toBe('b');
    expect(r1.n.textContent).toBe('b');
  });

  describe('rendering inner nodes', () => {
    it('update text inner node', () => {
      const n = (text) => N('div', {}, {}, [text]);
      let r1 = patch(null, n(T('a')), document.body);
      const text = r1.c[0].n;
      expect(r1.c.length).toBe(1);
      expect(text.textContent).toBe('a');
      r1 = patch(r1, n(T('b')), document.body);
      expect(text.textContent).toBe('b');
    });

    it('changing inner node from div to p', () => {
      const n = (t) => N('div', {}, {}, [
	N(t, {}, {}, [
	  T('text')
	]),
      ]);
      let r1 = patch(null, n('div'), document.body);
      let a = r1.c[0].n;
      expect(a.nodeName).toBe('DIV');
      patch(r1, n('p'), document.body);
      a = r1.c[0].n;
      expect(document.body.firstChild.firstChild.nodeName).toBe(a.nodeName);
    });

    it('changing inner node from text to node', () => {
      const a = N('div', {}, {}, [
	T('abc')
      ]);

      const b = N('div', {}, {}, [
	N('div', {}, {}, [])
      ]);

      let r1 = patch(null, a, document.body);
      r1 = patch(r1, b, document.body);

      expect(document.body.firstChild.firstChild.nodeName).toBe('DIV');
    });

    it('changing inner node from node to text', () => {
      const a = N('div', {}, {}, [
	N('div', {}, {}, [])
      ]);

      const b = N('div', {}, {}, [
	T('abc')
      ]);

      let r1 = patch(null, a, document.body);
      r1 = patch(r1, b, document.body);

      expect(document.body.firstChild.firstChild.nodeName).toBe('#text');
    });
  });
});

describe('managing attributes', () => {
  afterEach(clean);

  it('setting up an attribute', () => {
    const n = N('button', { 'class': 'btn' }, {}, [T('text')]);
    let r1 = patch(null, n, document.body);
    expect(document.querySelector('.btn')).not.toBeNull();
  });

  it('removing an attribute', () => {
    const n1 = N('button', { 'class': 'btn' }, {}, [T('text')]);
    const n2 = N('button', { 'class': null }, {}, [T('text')]);
    let r1 = patch(null, n1, document.body);
    r1 = patch(r1, n2, document.body);
    expect(document.querySelector('.btn')).toBeNull();
  });

  it('replacing attribute', () => {
    const n1 = N('button', { 'class': 'btn' }, {}, [T('text')]);
    const n2 = N('button', { 'class': 'btn2' }, {}, [T('text')]);
    let r1 = patch(null, n1, document.body);
    r1 = patch(r1, n2, document.body);
    expect(document.querySelector('.btn')).toBeNull();
    expect(document.querySelector('.btn2')).not.toBeNull();
  });
});

describe('managing listeners', () => {
  afterEach(clean);

  it('setting up a listener', () => {
    const f = jest.fn();
    const n = N('button', { 'class': 'btn' }, { 'click': f }, [T('text')]);
    let r1 = patch(null, n, document.body);
    document.querySelector('.btn').click();
    expect(f).toHaveBeenCalled();
  });

  it('disabling a listener', () => {
    const f = jest.fn();
    const n1 = N('button', { 'class': 'btn' }, { 'click': f }, [T('text')]);
    const n2 = N('button', { 'class': 'btn' }, { 'click': null }, [T('text')]);
    let r1 = patch(null, n1, document.body);
    r1 = patch(r1, n2, document.body);
    document.querySelector('.btn').click();
    expect(f).not.toHaveBeenCalled();
  });

  it('replacing listener', () => {
    const f = jest.fn();
    const g = jest.fn();
    const n1 = N('button', { 'class': 'btn' }, { 'click': f }, [T('text')]);
    const n2 = N('button', { 'class': 'btn' }, { 'click': g }, [T('text')]);
    let r1 = patch(null, n1, document.body);
    r1 = patch(r1, n2, document.body);
    document.querySelector('.btn').click();
    expect(f).not.toHaveBeenCalled();
    expect(g).toHaveBeenCalled();
  });
});
