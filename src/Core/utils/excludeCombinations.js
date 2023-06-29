export function mergeContainingNumberCombinations(combinations) {
  // combinations is an array of arrays
  // Each combination array contains the numbers to be excluded from a sample.
  // Some values of a combination could be NaN, which indicates they are wildcards and could match anything.
  // For example, [NaN, 9, 8], indicates that a sample with a 9 and 8 in the 2nd and 3rd slot, respectively,
  // is always excluded, independent of the number in the first slot.
  // If the combinations list contains two combinations where one is contained in the other,
  // then we merge the combinations in a single combination.
  // For example, [NaN, 9, 8] and [Nan, 9, NaN] would be merged into [NaN, 9, NaN],
  // as excluding all combinations with a 9 in the second slot covers both excluded combinations

  // Note: the algorithm isn't designed to find all possible merges, but instead to find at least one merge
  // if is available.  The idea is to continue to run this algorithm until no more merges are found.
  // (We aren't worrying about computational efficiency as we're working with small arrays.)

  // Returns object with entries
  // - merged: true if some combinations were merged
  // - combinations: the merged list of combinations

  if (combinations.length === 0) {
    return { merged: false, combinations: [] };
  }

  let mergedCombinations = [combinations[0]];

  let mergedAtLeastOne = false;

  for (let comb of combinations.slice(1)) {
    let newCombinations = [];
    let merged = false;

    for (let oldComb of mergedCombinations) {
      if (merged) {
        // if we already merged comb with an combination
        // just add all the remaining oldCombs onto the list
        // The idea is we'll rerun this algorithm to find further merges
        newCombinations.push(oldComb);
        continue;
      }
      let newComb = [];
      merged = true;
      let mergingInto = null;
      for (let k = 0; k < comb.length; k++) {
        let v1 = comb[k],
          v2 = oldComb[k];
        if (Number.isNaN(v1)) {
          if (Number.isNaN(v2)) {
            // If both are wildcards, add wildcard to potential emrged combination
            newComb.push(NaN);
          } else {
            // since value is a wildcard (NaN) in 1 but not 2,
            // this indicates we should nerge 2 into 1
            if (mergingInto === 2) {
              // We already merging into 2 (which means previously 2 had a wildcard where 1 did not)
              // The combinations are not contained in one another, so we cannot merge them.
              merged = false;
              break;
            } else {
              // In the potential merged combination we put the wildcard from 1 for this entry
              newComb.push(NaN);
              mergingInto = 1;
            }
          }
        } else if (Number.isNaN(v2)) {
          // since value is a wildcard (NaN) in 2 but not 1,
          // this indicates we should nerge 1 into 2
          if (mergingInto === 1) {
            // We already merging into 1 (which means previously 1 had a wildcard where 2 did not)
            // The combinations are not contained in one another, so we cannot merge them.
            merged = false;
            break;
          } else {
            // In the potential merged combination we put the wildcard from 2 for this entry
            newComb.push(NaN);
            mergingInto = 2;
          }
        } else {
          if (v1 === v2) {
            // values matched, so add value to potential emrged combination
            newComb.push(v1);
          } else {
            // values don't match, so the combinations are not contained in one another
            merged = false;
            break;
          }
        }
      }

      if (merged) {
        newCombinations.push(newComb);
      } else {
        // We didn't merge comb with oldComb, so just add oldComb onto the list
        newCombinations.push(oldComb);
      }
    }

    // only add comb to the list if it wasn't merged
    if (merged) {
      mergedAtLeastOne = true;
    } else {
      newCombinations.push(comb);
    }

    mergedCombinations = newCombinations;
  }

  return {
    merged: mergedAtLeastOne,
    combinations: mergedCombinations,
  };
}

export function checkForExcludedCombination({
  type,
  excludedCombinations,
  values,
}) {
  if (type === "math") {
    return excludedCombinations.some((x) =>
      x.every((v, i) => v.equals(values[i])),
    );
  } else if (type === "number") {
    // if one entry of excluded combinations is NaN, then it is a wildcard
    // that will match any value
    return excludedCombinations.some((x) =>
      x.every(
        (v, i) =>
          Number.isNaN(v) ||
          Math.abs(v - values[i]) <=
            1e-14 * Math.max(Math.abs(v), Math.abs(values[i])),
      ),
    );
  } else {
    return excludedCombinations.some((x) => x.every((v, i) => v === values[i]));
  }
}

export function estimateNumberOfNumberCombinationsExcluded({
  excludedCombinations,
  numValues,
  withReplacement,
  numToSelect,
}) {
  // Account for fact that an excluded combination with a NaN is a wildcard.
  // This could be an overestimate, as different combinations could match the same value.
  let numCombinationsExcluded = 0;
  for (let comb of excludedCombinations) {
    let numNans = comb.reduce((a, c) => a + (Number.isNaN(c) ? 1 : 0), 0);

    if (numNans > 0) {
      if (withReplacement) {
        numCombinationsExcluded += Math.pow(numValues, numNans);
      } else {
        let n = numValues - numToSelect + numNans;
        let nExcl = n;
        for (let i = 1; i < numNans; i++) {
          nExcl *= n - i;
        }
        numCombinationsExcluded += nExcl;
      }
    } else {
      numCombinationsExcluded += 1;
    }
  }
  return numCombinationsExcluded;
}

export function estimateNumberOfDuplicateCombinations(
  combinations,
  numValues,
  withReplacement,
) {
  // if have wildcards, get better estimate of number excluded

  let nCombs = combinations.length;

  if (nCombs === 0) {
    return 0;
  }

  let duplicateCombinations = [];
  for (let i = 0; i < nCombs; i++) {
    let comb1 = combinations[i];
    for (let j = i + 1; j < nCombs; j++) {
      let comb2 = combinations[j];
      let foundDuplicate = true;
      let duplicate = [];
      for (let k = 0; k < comb1.length; k++) {
        let v1 = comb1[k],
          v2 = comb2[k];
        if (Number.isNaN(v1)) {
          if (Number.isNaN(v2)) {
            duplicate.push(NaN);
          } else {
            duplicate.push(v2);
          }
        } else if (Number.isNaN(v2)) {
          duplicate.push(v1);
        } else {
          if (v1 === v2) {
            duplicate.push(v1);
          } else {
            foundDuplicate = false;
            break;
          }
        }
      }

      if (foundDuplicate) {
        if (withReplacement) {
          duplicateCombinations.push(duplicate);
        } else {
          let nonNanEntries = duplicate.filter((x) => !Number.isNaN(x));
          if ([...new Set(nonNanEntries)].length === nonNanEntries.length) {
            duplicateCombinations.push(duplicate);
          }
        }
      }
    }
  }

  // TODO: get a more accurate count of the number of excluded combinations.
  // This is just a heuristic to reduce the count
  while (true) {
    let result = mergeContainingNumberCombinations(duplicateCombinations);

    if (result.merged) {
      duplicateCombinations = result.combinations;
    } else {
      break;
    }
  }

  let numberDuplicated = 0;

  if (duplicateCombinations.length > 0) {
    for (let comb of duplicateCombinations) {
      let numNans = comb.reduce((a, c) => a + (Number.isNaN(c) ? 1 : 0), 0);

      if (numNans > 0) {
        if (withReplacement) {
          numberDuplicated += Math.pow(numValues, numNans);
        } else {
          let n = numValues - comb.length + numNans;
          let nDup = n;
          for (let i = 1; i < numNans; i++) {
            nDup *= n - i;
          }
          numberDuplicated += nDup;
        }
      } else {
        numberDuplicated += 1;
      }
    }
  }

  numberDuplicated -= estimateNumberOfDuplicateCombinations(
    duplicateCombinations,
    numValues,
    withReplacement,
  );

  return numberDuplicated;
}
