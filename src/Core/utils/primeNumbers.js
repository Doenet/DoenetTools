export function createPrimesList({
  minValue = 2,
  maxValue = 100,
  exclude = [],
}) {
  // Use Sieve of Eratosthenes to generate list of all prime numbers from minValue to maxValue
  // and exclude values from exclude

  minValue = Math.max(minValue, 2);

  if (
    !(
      Number.isFinite(minValue) &&
      Number.isFinite(maxValue) &&
      maxValue >= minValue
    )
  ) {
    return [];
  }

  let valueList = [...Array(maxValue + 1).keys()];

  let sqrtMax = Math.sqrt(maxValue);

  for (let i = 2; i <= sqrtMax; i++) {
    if (valueList[i]) {
      for (let j = i * i; j <= maxValue; j += i) {
        valueList[j] = 0;
      }
    }
  }

  let primes = valueList
    .slice(minValue)
    .filter((x) => x && !exclude.includes(x));

  return primes;
}
