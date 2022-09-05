const maxWidth = 850;

export const sizePossibilities = ["tiny", "small", "medium", "large", "full"];

const widthFactions = [1 / 12, 0.3, 0.5, 0.7, 1];
const fractionMidpoints = widthFactions.map((x, i) => (x + (widthFactions[i + 1] || Infinity)) / 2);

export const orderedWidthMidpoints = fractionMidpoints.map(x => maxWidth * x);
export const orderedPercentWidthMidpoints = fractionMidpoints.map(x => x * 100);

export const widthsBySize = {};
sizePossibilities.forEach((x, i) => widthsBySize[x] = Math.floor(widthFactions[i] * maxWidth));
