const d = document;

function patch(a, b, p) {
  let re, e = (!!a * 2) + !!b;
  return e > 0 ? (
    re = e > 2 && a.k === b.k,
    (e > 1 && !re) && p.removeChild(a.n),
    e > 2 && a.update(b, p),
    (e == 1 || (b && !re)) ? (b.create(p), b) : (b && a)
  ) : null;
}

function patchList(a, b, p) {
  let inner = Math.max(a.length, b.length);
  const cs = [];
  for (let i = 0; i < inner; i++) {
    const u = patch(a[i], b[i], p);
    u && cs.push(u);
  }
  return cs;
}

function applyAttr(a, re) {
  return function (n, m, b) {
    for (let attr in b) {
      let o = m[attr], r = b[attr], e = (!!o * 2) + !!r;
      m[attr] = (
	e > 1 && n[re](attr, o),
	(e == 1 || r) && (n[a](attr, r), r)
      );
    }
  }
}

const manageAttr = applyAttr('setAttribute', 'removeAttribute');
const manageListeners = applyAttr('addEventListener', 'removeEventListener');

function VNode(k, o, l, c) {
  this.k = k, this.o = o, this.c = c, this.l = l, this.n = null;
}

const N = (k, o, l, c) => new VNode(k, o, l, c);

const np = VNode.prototype;

np.create = function(p) {
  const { k, o, c, l } = this;
  const el = d.createElement(k);
  manageAttr(el, o, o);
  manageListeners(el, l, l);
  for (let ch of c) { ch.create(el); }
  p.appendChild(el);
  this.n = el;
}

np.update = function(b, p) {
  const { o, c, l, n } = this;
  manageAttr(n, o, b.o);
  manageListeners(n, l, b.l);
  this.c = patchList(c, b.c, n);
}

function VNodeText(s) {
  if (!(this instanceof VNodeText)) return new VNodeText(s);
  this.s = s, this.n = null;
}

const T = (s) => new VNodeText(s);

const tp = VNodeText.prototype;

tp.create = function(p) {
  const c = d.createTextNode(this.s);
  p.appendChild(c);
  this.n = c;
}

tp.update = function(b, p) {
  this.s != b.s && (this.n.textContent = (this.s = b.s));
}

module.exports = {
  T, N, patch,
}
