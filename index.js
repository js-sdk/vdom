const d = document;

function patch(a, b, p) {
  let re; return a && b ?
      (
	re = a.k === b.k,
	a.update(re ? b : null, p),
	re ? a : (b.create(p), b)
      ) :
      a ? a.update(b, p) : (b.create(p), b);
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

function applyAttr(n, m, b) {
  for (let attr in b) {
    m[attr] = b[attr] ?
      (n.setAttribute(attr, b[attr]), b[attr]) :
      n.removeAttribute(attr);
  }
}

function manageListeners(n, m, b) {
  for (let attr in b) {
    m[attr] = b[attr] ?
      (n.addEventListener(attr, b[attr]), b[attr]) :
      (n.removeEventListener(attr, m[attr]), null);
  }
}

function VNode(k, o, l, c) {
  this.k = k, this.o = o, this.c = c, this.l = l, this.n = null;
}

const N = (k, o, l, c) => new VNode(k, o, l, c);

const np = VNode.prototype;

np.create = function(p) {
  const { k, o, c, l } = this;
  const el = d.createElement(k);
  applyAttr(el, o, o);
  manageListeners(el, l, l);
  for (let ch of c) { ch.create(el); }
  p.appendChild(el);
  this.n = el;
}

np.update = function(b, p) {
  if (!b) p.removeChild(this.n);
  else {
    const { o, c, l, n } = this;
    applyAttr(n, o, b.o);
    manageListeners(n, l, b.l);
    this.c = patchList(c, b.c, n);
  }
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
  !b ? p.removeChild(this.n) : (this.n.textContent = (this.s = b.s));
}

module.exports = {
  T, N, patch,
}
