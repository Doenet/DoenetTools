export function sampleFromRandomNumbers({
  type,
  numSamples,
  standardDeviation,
  mean,
  to,
  from,
  step,
  exclude,
  numDiscreteValues,
  rng,
}) {
  if (type === "gaussian") {
    if (!(standardDeviation >= 0) || !Number.isFinite(mean)) {
      let message =
        "Invalid mean (" +
        mean +
        ") or standard deviation (" +
        standardDeviation +
        ") for a gaussian random variable.";
      console.warn(message);

      return Array(numSamples).fill(NaN);
    }

    let sampledValues = [];

    for (let i = 0; i < numSamples; i++) {
      // Standard Normal variate using Box-Muller transform.
      let u = 0,
        v = 0;
      while (u === 0) {
        u = rng();
      }
      while (v === 0) {
        v = rng();
      }
      let standardNormal =
        Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

      // transform to correct parameters
      sampledValues.push(mean + standardDeviation * standardNormal);
    }

    return sampledValues;
  } else if (type === "uniform") {
    let sampledValues = [];

    let diff = to - from;

    for (let i = 0; i < numSamples; i++) {
      sampledValues.push(from + rng() * diff);
    }

    return sampledValues;
  } else {
    // discreteuniform
    let sampledValues = [];

    if (numDiscreteValues > 0) {
      let indexMap = [...Array(numDiscreteValues).keys()];

      if (exclude.length > 0) {
        indexMap = [];
        let numOrigValues = Math.round((to - from) / step + 1);
        for (let i = 0; i < numOrigValues; i++) {
          let val = from + i * step;
          if (!exclude.includes(val)) {
            indexMap.push(i);
          }
        }
      }

      for (let i = 0; i < numSamples; i++) {
        // random integer from 0 to numDiscreteValues-1
        let ind = Math.floor(rng() * numDiscreteValues);

        // adjust for excludes
        ind = indexMap[ind];

        sampledValues.push(from + step * ind);
      }
    }

    return sampledValues;
  }
}
