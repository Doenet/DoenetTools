const maxWidth = 850;

export const orderedSizePossibilities = [
  ["tiny", 70],
  ["small", Math.floor(maxWidth * 0.3)],
  ["medium", Math.floor(maxWidth * 0.5)],
  ["large", Math.floor(maxWidth * 0.7)],
  ["full", maxWidth],
]

export const orderedPercentPossibilities = orderedSizePossibilities
  .map(obj => [obj[0], Math.round(obj[1] / maxWidth * 100)]);

export const sizePossibilitiesByName = {};
orderedSizePossibilities.forEach(obj => sizePossibilitiesByName[obj[0]] = obj[1]);

export const sizePossibilityNames = orderedPercentPossibilities.map(obj => obj[0]);