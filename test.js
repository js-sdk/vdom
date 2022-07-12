/* @jest-environment jsdom */

const { patch, T, N } = require('./index.js');

const template = `<!DOCTYPE html><html><body /></html>`;

describe('creating nodes', () => {
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
  it('text node', () => {
    let r1 = patch(null, T('text'), document.body);
    r1 = patch(r1, null, document.body);
    expect(r1).toBeUndefined();
  });

  it('node', () => {
    let r1 = patch(null, N('div', {}, {}, []), document.body);
    r1 = patch(r1, null, document.body);
    expect(r1).toBeUndefined();
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
      expect(a.nodeName).toBe('P');
    });
  });
});

describe('managing listeners', () => {
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
});
