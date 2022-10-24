const maxWidth = 850;

export const sizePossibilities = ["tiny", "small", "medium", "large", "full"];

export const widthFractions = [1 / 12, 0.3, 0.5, 0.7, 1];
const fractionMidpoints = widthFractions.map((x, i) => (x + (widthFractions[i + 1] || Infinity)) / 2);

export const orderedWidthMidpoints = fractionMidpoints.map(x => maxWidth * x);
export const orderedPercentWidthMidpoints = fractionMidpoints.map(x => x * 100);

export const widthsBySize = {};
sizePossibilities.forEach((x, i) => widthsBySize[x] = Math.floor(widthFractions[i] * maxWidth));
export const percentWidthsBySize = {};
sizePossibilities.forEach((x, i) => percentWidthsBySize[x] = Math.round(widthFractions[i] * 100));

