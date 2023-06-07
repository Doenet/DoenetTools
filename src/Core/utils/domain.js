import me from "math-expressions";

export function find_effective_domain({
  domain,
  truncateToFiniteDomain = false,
  xscale = 1,
}) {
  // Works only for 1 dimension.

  // Arguments
  // - domain: an array of intervals for the domain for each dimension, only first entry is used
  // - truncateToFiniteDomain: if true, infinite domains are made finite base on xscale
  // - xscale: whole real line is truncated to [-100*xscale, 100*xscale]
  //   If one endpoint is specified, domain length is 200*xscale

  // returns
  // - minx: left endpoint
  // - maxx: right endoint
  // - openMin: true if left of interval is open
  // - openMax: true if right of interval is open

  let minx = -Infinity;
  let maxx = Infinity;
  let openMin = false,
    openMax = false;

  if (domain !== null) {
    let domain1 = domain[0];
    if (domain1 !== undefined) {
      minx = me.fromAst(domain1.tree[1][1]).evaluate_to_constant();
      if (!Number.isFinite(minx)) {
        minx = -Infinity;
      } else {
        openMin = !domain1.tree[2][1];
      }
      maxx = me.fromAst(domain1.tree[1][2]).evaluate_to_constant();
      if (!Number.isFinite(maxx)) {
        maxx = Infinity;
      } else {
        openMax = !domain1.tree[2][2];
      }
    }
  }

  if (truncateToFiniteDomain) {
    if (minx === -Infinity) {
      if (maxx === Infinity) {
        minx = -100 * xscale;
        maxx = 100 * xscale;
      } else {
        minx = maxx - 200 * xscale;
      }
    } else if (maxx === Infinity) {
      maxx = minx + 200 * xscale;
    }
  }

  return { minx, maxx, openMin, openMax };
}
