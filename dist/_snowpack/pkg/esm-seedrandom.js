function _prng_restore(prng, xg, opts) {
  let state = opts && opts.state;
  if (state) {
    if (typeof state == "object")
      xg.copy(state, xg);
    prng.state = () => xg.copy(xg, {});
  }
}
function prng_alea(seed, opts) {
  let xg = new AleaGen(seed);
  let prng = () => xg.next();
  prng.double = () => prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
  prng.int32 = () => xg.next() * 4294967296 | 0;
  prng.quick = prng;
  _prng_restore(prng, xg, opts);
  return prng;
}
class AleaGen {
  constructor(seed) {
    if (seed == null)
      seed = +new Date();
    let n = 4022871197;
    this.c = 1;
    this.s0 = mash(" ");
    this.s1 = mash(" ");
    this.s2 = mash(" ");
    this.s0 -= mash(seed);
    if (this.s0 < 0) {
      this.s0 += 1;
    }
    this.s1 -= mash(seed);
    if (this.s1 < 0) {
      this.s1 += 1;
    }
    this.s2 -= mash(seed);
    if (this.s2 < 0) {
      this.s2 += 1;
    }
    function mash(data) {
      data = String(data);
      for (let i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        let h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 4294967296;
      }
      return (n >>> 0) * 23283064365386963e-26;
    }
  }
  next() {
    let {c, s0, s1, s2} = this;
    let t = 2091639 * s0 + c * 23283064365386963e-26;
    this.s0 = s1;
    this.s1 = s2;
    return this.s2 = t - (this.c = t | 0);
  }
  copy(f, t) {
    t.c = f.c;
    t.s0 = f.s0;
    t.s1 = f.s1;
    t.s2 = f.s2;
    return t;
  }
}

export { prng_alea };
