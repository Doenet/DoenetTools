export function sampleFromRandomNumbers({
  type,
  numSamples,
  standardDeviation,
  mean,
  to,
  from,
  step,
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
      for (let i = 0; i < numSamples; i++) {
        // random integer from 0 to numDiscreteValues-1
        let ind = Math.floor(rng() * numDiscreteValues);

        sampledValues.push(from + step * ind);
      }
    }

    return sampledValues;
  }
}

export function sampleFromNumberList({
  possibleValues,
  numUniqueRequired = 1,
  numSamples = 1,
  rng,
}) {
  let numPossibleValues = possibleValues.length;

  if (numUniqueRequired === 1) {
    let sampledValues = [];
    for (let ind = 0; ind < numSamples; ind++) {
      // random number in [0, 1)
      let rand = rng();
      // random integer from 0 to numPossibleValues-1
      let ind = Math.floor(rand * numPossibleValues);

      sampledValues.push(possibleValues[ind]);
    }

    return sampledValues;
  }

  // need to select more than one value without replacement
  // shuffle array and choose first elements
  // https://stackoverflow.com/a/12646864
  let shuffledValues = [...possibleValues];
  for (let i = shuffledValues.length - 1; i > 0; i--) {
    const rand = rng();
    const j = Math.floor(rand * (i + 1));
    [shuffledValues[i], shuffledValues[j]] = [
      shuffledValues[j],
      shuffledValues[i],
    ];
  }

  let sampledValues = shuffledValues.slice(0, numSamples);

  return sampledValues;
}
